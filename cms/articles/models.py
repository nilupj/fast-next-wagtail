from django.db import models
from wagtail.snippets.models import register_snippet

from modelcluster.fields import ParentalKey
from modelcluster.contrib.taggit import ClusterTaggableManager
from taggit.models import TaggedItemBase

from wagtail.models import Page
from wagtail.fields import RichTextField
from wagtail.admin.panels import FieldPanel, MultiFieldPanel
from wagtail.search import index
from wagtail.api import APIField

@register_snippet
class ArticleAuthor(models.Model):
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

@register_snippet
class ArticleCategory(models.Model):
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


class ArticleIndexPage(Page):
    intro = RichTextField(blank=True)

    content_panels = Page.content_panels + [
        FieldPanel('intro')
    ]

    def get_context(self, request):
        context = super().get_context(request)
        context['articles'] = ArticlePage.objects.child_of(self).live().order_by('-first_published_at')
        return context

    class Meta:
        verbose_name = "Article Index Page"


class ArticleListingPage(Page):
    intro = RichTextField(blank=True)

    content_panels = Page.content_panels + [
        FieldPanel('intro')
    ]

    class Meta:
        verbose_name = "Article Listing Page"


class ArticlePageTag(TaggedItemBase):
    content_object = ParentalKey(
        'ArticlePage',
        related_name='tagged_items',
        on_delete=models.CASCADE
    )


class ArticlePage(Page):
    subtitle = models.CharField(max_length=255, blank=True)
    subtitle_hi = models.CharField(max_length=255, blank=True, verbose_name="Subtitle (Hindi)")
    summary = models.TextField(blank=True)
    summary_hi = models.TextField(blank=True, verbose_name="Summary (Hindi)")
    body = RichTextField()
    body_hi = RichTextField(blank=True, verbose_name="Body (Hindi)")
    featured = models.BooleanField(default=False)
    view_count = models.PositiveIntegerField(default=0)
    
    tags = ClusterTaggableManager(through=ArticlePageTag, blank=True)
    
    author = models.ForeignKey(
        ArticleAuthor,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='articles'
    )
    
    category = models.ForeignKey(
        ArticleCategory,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='articles'
    )
    
    image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )

    search_fields = Page.search_fields + [
        index.SearchField('title'),
        index.SearchField('subtitle'),
        index.SearchField('body'),
        index.SearchField('summary'),
        index.FilterField('author'),
        index.FilterField('category'),
    ]

    content_panels = Page.content_panels + [
        FieldPanel('subtitle'),
        FieldPanel('summary'),
        FieldPanel('body'),
        FieldPanel('author'),
        FieldPanel('category'),
        FieldPanel('tags'),
        FieldPanel('featured'),
        FieldPanel('image'),
    ]

    api_fields = [
        APIField('title'),
        APIField('subtitle'),
        APIField('summary'),
        APIField('body'),
        APIField('featured'),
        APIField('author'),
        APIField('category'),
        APIField('tags'),
        APIField('image'),
        APIField('view_count'),
    ]

    class Meta:
        verbose_name = "Article Page"