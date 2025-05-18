
from django.db import models
from wagtail.models import Page
from wagtail.fields import RichTextField
from wagtail.admin.panels import FieldPanel
from wagtail.search import index
from wagtail.api import APIField

class NewsIndexPage(Page):
    """Landing page for health news."""
    intro = RichTextField(blank=True)

    content_panels = Page.content_panels + [
        FieldPanel('intro')
    ]

    class Meta:
        verbose_name = "News Index Page"

class NewsCategory(models.Model):
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
        verbose_name = "News Category"
        verbose_name_plural = "News Categories"

class NewsPage(Page):
    subtitle = models.CharField(max_length=255, blank=True)
    summary = models.TextField(blank=True)
    body = RichTextField()
    publish_date = models.DateTimeField(auto_now_add=True)
    featured = models.BooleanField(default=False)
    view_count = models.PositiveIntegerField(default=0)
    source = models.CharField(max_length=255, blank=True)
    
    category = models.ForeignKey(
        NewsCategory,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='news'
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
        index.FilterField('category'),
        index.FilterField('featured'),
    ]

    content_panels = Page.content_panels + [
        FieldPanel('subtitle'),
        FieldPanel('summary'),
        FieldPanel('body'),
        FieldPanel('source'),
        FieldPanel('category'),
        FieldPanel('featured'),
        FieldPanel('image'),
    ]

    api_fields = [
        APIField('title'),
        APIField('subtitle'),
        APIField('summary'),
        APIField('body'),
        APIField('publish_date'),
        APIField('featured'),
        APIField('category'),
        APIField('source'),
        APIField('image'),
        APIField('view_count'),
    ]

    class Meta:
        verbose_name = "News Page"
