from django.db import models

from modelcluster.fields import ParentalKey
from modelcluster.contrib.taggit import ClusterTaggableManager
from taggit.models import TaggedItemBase

from wagtail.models import Page, Orderable
from wagtail.fields import RichTextField
from wagtail.admin.panels import FieldPanel, InlinePanel, MultiFieldPanel
from wagtail.search import index
from wagtail.api import APIField

# For simplicity, we're creating minimal models to make the CMS work
# These will be expanded with more fields later

class ArticleIndexPage(Page):
    """
    A page that lists all articles
    """
    intro = RichTextField(blank=True)
    
    content_panels = Page.content_panels + [
        FieldPanel('intro'),
    ]
    
    # Parent/child page type rules
    parent_page_types = ['home.HomePage']
    subpage_types = ['articles.ArticlePage', 'articles.ArticleListingPage']
    
    class Meta:
        verbose_name = "Article Index Page"


class ArticleListingPage(Page):
    """
    A page that lists articles by category
    """
    intro = RichTextField(blank=True)
    
    content_panels = Page.content_panels + [
        FieldPanel('intro'),
    ]
    
    # Parent/child page type rules
    parent_page_types = ['articles.ArticleIndexPage']
    subpage_types = []
    
    class Meta:
        verbose_name = "Article Listing Page"


class ArticlePageTag(TaggedItemBase):
    """
    Tagging system for ArticlePage
    """
    content_object = ParentalKey(
        'ArticlePage',
        related_name='tagged_items',
        on_delete=models.CASCADE
    )


class ArticleCategory(models.Model):
    """
    Category for articles
    """
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, max_length=80)
    description = models.TextField(blank=True)
    
    panels = [
        FieldPanel('name'),
        FieldPanel('slug'),
        FieldPanel('description'),
    ]
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = "Article Category"
        verbose_name_plural = "Article Categories"


class ArticleAuthor(models.Model):
    """
    Article author
    """
    name = models.CharField(max_length=255)
    credentials = models.CharField(max_length=255, blank=True)
    bio = models.TextField(blank=True)
    image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )
    
    panels = [
        FieldPanel('name'),
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
    A page for a single article
    """
    subtitle = models.CharField(max_length=255, blank=True)
    summary = models.TextField(blank=True)
    body = RichTextField()
    image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )
    tags = ClusterTaggableManager(through=ArticlePageTag, blank=True)
    category = models.ForeignKey(
        ArticleCategory,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='articles'
    )
    author = models.ForeignKey(
        ArticleAuthor,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='articles'
    )
    featured = models.BooleanField(default=False)
    view_count = models.PositiveIntegerField(default=0)
    
    # Search index configuration
    search_fields = Page.search_fields + [
        index.SearchField('title'),
        index.SearchField('subtitle'),
        index.SearchField('summary'),
        index.SearchField('body'),
    ]
    
    # API fields for the API
    api_fields = [
        APIField('title'),
        APIField('subtitle'),
        APIField('summary'),
        APIField('body'),
        APIField('image'),
        APIField('tags'),
        APIField('category'),
        APIField('author'),
        APIField('featured'),
        APIField('view_count'),
    ]
    
    # Editor panels configuration
    content_panels = Page.content_panels + [
        FieldPanel('subtitle'),
        FieldPanel('summary'),
        FieldPanel('body'),
        FieldPanel('image'),
        FieldPanel('tags'),
        FieldPanel('category'),
        FieldPanel('author'),
        FieldPanel('featured'),
    ]
    
    # Parent/child page type rules
    parent_page_types = ['articles.ArticleIndexPage']
    subpage_types = []
    
    def increase_view_count(self):
        """
        Increment the view count for this article
        """
        self.view_count += 1
        self.save()
    
    class Meta:
        verbose_name = "Article Page"