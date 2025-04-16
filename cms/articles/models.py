from django.db import models
from django import forms
from django.core.paginator import EmptyPage, PageNotAnInteger, Paginator
from django.utils.translation import gettext_lazy as _

from wagtail.models import Page, Orderable
from wagtail.fields import RichTextField, StreamField
from wagtail.admin.panels import FieldPanel, InlinePanel, MultiFieldPanel
from wagtail.search import index
from wagtail.snippets.models import register_snippet
from wagtail.images import get_image_model_string
from wagtail.api import APIField

from modelcluster.fields import ParentalKey, ParentalManyToManyField
from modelcluster.contrib.taggit import ClusterTaggableManager
from taggit.models import TaggedItemBase

class ArticleIndexPage(Page):
    """
    Index page for articles, which displays all available articles.
    """
    intro = RichTextField(blank=True)
    
    content_panels = Page.content_panels + [
        FieldPanel('intro')
    ]
    
    subpage_types = ['articles.ArticlePage']
    parent_page_types = ['home.HomePage']
    
    def get_context(self, request):
        context = super().get_context(request)
        
        # Filter by tag
        tag = request.GET.get('tag')
        articles = ArticlePage.objects.child_of(self).live().order_by('-first_published_at')
        
        if tag:
            articles = articles.filter(tags__name=tag)
        
        # Filter by category
        category = request.GET.get('category')
        if category:
            articles = articles.filter(categories__name=category)
            
        # Pagination
        page = request.GET.get('page')
        paginator = Paginator(articles, 12)  # Show 12 articles per page
        
        try:
            articles = paginator.page(page)
        except PageNotAnInteger:
            articles = paginator.page(1)
        except EmptyPage:
            articles = paginator.page(paginator.num_pages)
            
        context['articles'] = articles
        return context
    
    class Meta:
        verbose_name = "Article Index Page"


class ArticlePageTag(TaggedItemBase):
    """
    Tag for ArticlePage
    """
    content_object = ParentalKey(
        'ArticlePage',
        related_name='tagged_items',
        on_delete=models.CASCADE
    )


@register_snippet
class ArticleCategory(models.Model):
    """
    Category for categorizing ArticlePage
    """
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, max_length=255)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=100, blank=True)
    
    panels = [
        FieldPanel('name'),
        FieldPanel('slug'),
        FieldPanel('description'),
        FieldPanel('icon'),
    ]
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = "Article Category"
        verbose_name_plural = "Article Categories"


class ArticleAuthor(models.Model):
    """
    Author for ArticlePage
    """
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, max_length=255)
    credentials = models.CharField(max_length=255, blank=True)
    bio = models.TextField(blank=True)
    image = models.ForeignKey(
        get_image_model_string(),
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )
    
    panels = [
        FieldPanel('name'),
        FieldPanel('slug'),
        FieldPanel('credentials'),
        FieldPanel('bio'),
        FieldPanel('image'),
    ]
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = "Article Author"
        verbose_name_plural = "Article Authors"


class ArticlePage(Page):
    """
    A page for articles
    """
    subtitle = models.CharField(max_length=255, blank=True)
    
    image = models.ForeignKey(
        get_image_model_string(),
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )
    
    body = RichTextField()
    
    tags = ClusterTaggableManager(through=ArticlePageTag, blank=True)
    
    categories = ParentalManyToManyField('articles.ArticleCategory', blank=True)
    
    author = models.ForeignKey(
        'articles.ArticleAuthor',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )
    
    featured = models.BooleanField(default=False)
    
    view_count = models.PositiveIntegerField(default=0)
    
    def increase_view_count(self):
        """
        Increase the view count for this article.
        """
        self.view_count += 1
        self.save(update_fields=['view_count'])
    
    content_panels = Page.content_panels + [
        FieldPanel('subtitle'),
        FieldPanel('image'),
        FieldPanel('body'),
        FieldPanel('author'),
        FieldPanel('categories', widget=forms.CheckboxSelectMultiple),
        FieldPanel('tags'),
        FieldPanel('featured'),
    ]
    
    search_fields = Page.search_fields + [
        index.SearchField('title'),
        index.SearchField('subtitle'),
        index.SearchField('body'),
        index.RelatedFields('author', [
            index.SearchField('name'),
        ]),
        index.FilterField('featured'),
    ]
    
    api_fields = [
        APIField('title'),
        APIField('subtitle'),
        APIField('image'),
        APIField('body'),
        APIField('tags'),
        APIField('categories'),
        APIField('author'),
        APIField('featured'),
        APIField('view_count'),
        APIField('first_published_at'),
        APIField('last_published_at'),
    ]
    
    parent_page_types = ['articles.ArticleIndexPage']
    subpage_types = []
    
    def get_context(self, request):
        context = super().get_context(request)
        
        # Increase view count
        self.increase_view_count()
        
        # Get related articles
        related_articles = ArticlePage.objects.live().exclude(id=self.id)
        
        # First try to get articles in the same categories
        if self.categories.exists():
            category_articles = related_articles.filter(categories__in=self.categories.all()).distinct()
            if category_articles.count() >= 3:
                related_articles = category_articles
            
        # Then try with tags if not enough related by category
        if self.tags.exists() and related_articles.count() < 3:
            tag_articles = related_articles.filter(tags__name__in=self.tags.names()).distinct()
            related_articles = (related_articles | tag_articles).distinct()
            
        # Sort by publication date, limit to 3
        related_articles = related_articles.order_by('-first_published_at')[:3]
        context['related_articles'] = related_articles
        
        return context
    
    class Meta:
        verbose_name = "Article Page"


class ArticleListingPage(Page):
    """
    A page that lists articles by a particular topic/category/tag
    """
    intro = RichTextField(blank=True)
    
    filter_type = models.CharField(
        max_length=20,
        choices=[
            ('category', 'Category'),
            ('tag', 'Tag'),
            ('author', 'Author'),
            ('featured', 'Featured'),
            ('popular', 'Popular'),
            ('recent', 'Recent'),
        ],
        default='recent'
    )
    
    category = models.ForeignKey(
        'articles.ArticleCategory',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )
    
    tag = models.CharField(max_length=100, blank=True)
    
    author = models.ForeignKey(
        'articles.ArticleAuthor',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )
    
    content_panels = Page.content_panels + [
        FieldPanel('intro'),
        FieldPanel('filter_type'),
        FieldPanel('category'),
        FieldPanel('tag'),
        FieldPanel('author'),
    ]
    
    def get_context(self, request):
        context = super().get_context(request)
        
        articles = ArticlePage.objects.live()
        
        if self.filter_type == 'category' and self.category:
            articles = articles.filter(categories=self.category)
            context['filter_title'] = f"Category: {self.category.name}"
        
        elif self.filter_type == 'tag' and self.tag:
            articles = articles.filter(tags__name=self.tag)
            context['filter_title'] = f"Tag: {self.tag}"
        
        elif self.filter_type == 'author' and self.author:
            articles = articles.filter(author=self.author)
            context['filter_title'] = f"Author: {self.author.name}"
        
        elif self.filter_type == 'featured':
            articles = articles.filter(featured=True)
            context['filter_title'] = "Featured Articles"
        
        elif self.filter_type == 'popular':
            articles = articles.order_by('-view_count')
            context['filter_title'] = "Popular Articles"
        
        else:  # recent
            articles = articles.order_by('-first_published_at')
            context['filter_title'] = "Recent Articles"
        
        # Pagination
        page = request.GET.get('page')
        paginator = Paginator(articles, 12)  # Show 12 articles per page
        
        try:
            articles = paginator.page(page)
        except PageNotAnInteger:
            articles = paginator.page(1)
        except EmptyPage:
            articles = paginator.page(paginator.num_pages)
            
        context['articles'] = articles
        return context
    
    class Meta:
        verbose_name = "Article Listing Page"
