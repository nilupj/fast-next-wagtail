from django.db import models
from django.core.exceptions import ValidationError
from django.core.paginator import EmptyPage, PageNotAnInteger, Paginator
from django.utils.translation import gettext_lazy as _

from wagtail.models import Page
from wagtail.fields import RichTextField, StreamField
from wagtail.admin.panels import FieldPanel, MultiFieldPanel, InlinePanel
from wagtail.search import index
from wagtail.snippets.models import register_snippet
from wagtail.images.models import Image
from wagtail.images import get_image_model_string
from wagtail.contrib.settings.models import BaseSetting, register_setting

from modelcluster.fields import ParentalKey
from modelcluster.contrib.taggit import ClusterTaggableManager
from taggit.models import TaggedItemBase

class HomePage(Page):
    """
    The home page model for the HealthInfo website.
    """
    headline = models.CharField(
        max_length=255,
        help_text=_("Main headline for the home page"),
    )
    
    subheadline = models.CharField(
        max_length=255,
        help_text=_("Subheadline or tagline that appears below the main headline"),
        blank=True
    )
    
    hero_image = models.ForeignKey(
        get_image_model_string(),
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+',
        help_text=_("The main hero image that appears at the top of the home page")
    )
    
    about_title = models.CharField(
        max_length=255,
        default="About HealthInfo",
        help_text=_("Title for the about section")
    )
    
    about_text = RichTextField(
        features=['bold', 'italic', 'link'],
        help_text=_("A brief introduction to the website and its purpose")
    )
    
    featured_articles_title = models.CharField(
        max_length=255,
        default="Today's Top Stories",
        help_text=_("Title for the featured articles section")
    )
    
    trending_topics_title = models.CharField(
        max_length=255,
        default="Trending Health Topics",
        help_text=_("Title for the trending topics section")
    )

    content_panels = Page.content_panels + [
        MultiFieldPanel([
            FieldPanel('headline'),
            FieldPanel('subheadline'),
            FieldPanel('hero_image'),
        ], heading="Hero Section"),
        MultiFieldPanel([
            FieldPanel('about_title'),
            FieldPanel('about_text'),
        ], heading="About Section"),
        MultiFieldPanel([
            FieldPanel('featured_articles_title'),
        ], heading="Featured Articles Section"),
        MultiFieldPanel([
            FieldPanel('trending_topics_title'),
        ], heading="Trending Topics Section"),
    ]
    
    def get_context(self, request):
        context = super().get_context(request)
        
        # Get featured articles
        from articles.models import ArticlePage
        featured_articles = ArticlePage.objects.live().filter(featured=True).order_by('-first_published_at')[:5]
        context['featured_articles'] = featured_articles
        
        # Get trending topics (most viewed articles)
        trending_articles = ArticlePage.objects.live().order_by('-view_count')[:4]
        context['trending_articles'] = trending_articles
        
        # Get health conditions
        from conditions.models import ConditionPage
        popular_conditions = ConditionPage.objects.live().order_by('-view_count')[:8]
        context['popular_conditions'] = popular_conditions
        
        return context
    
    class Meta:
        verbose_name = "Home Page"


class ContentPage(Page):
    """
    A generic content page for basic information pages like About, Privacy Policy, etc.
    """
    introduction = models.TextField(
        blank=True,
        help_text=_("Introduction text that appears below the title")
    )
    
    body = RichTextField(
        help_text=_("Main content for the page")
    )
    
    content_panels = Page.content_panels + [
        FieldPanel('introduction'),
        FieldPanel('body'),
    ]
    
    search_fields = Page.search_fields + [
        index.SearchField('introduction'),
        index.SearchField('body'),
    ]
    
    class Meta:
        verbose_name = "Content Page"


@register_setting
class SocialMediaSettings(BaseSetting):
    """
    Social media settings for the website.
    """
    facebook = models.URLField(
        help_text=_("Facebook page URL"),
        blank=True
    )
    twitter = models.URLField(
        help_text=_("Twitter profile URL"),
        blank=True
    )
    instagram = models.URLField(
        help_text=_("Instagram profile URL"),
        blank=True
    )
    youtube = models.URLField(
        help_text=_("YouTube channel URL"),
        blank=True
    )
    linkedin = models.URLField(
        help_text=_("LinkedIn profile URL"),
        blank=True
    )
    
    panels = [
        FieldPanel('facebook'),
        FieldPanel('twitter'),
        FieldPanel('instagram'),
        FieldPanel('youtube'),
        FieldPanel('linkedin'),
    ]
    
    class Meta:
        verbose_name = "Social Media Settings"


@register_setting
class SiteSettings(BaseSetting):
    """
    General settings for the website.
    """
    site_name = models.CharField(
        max_length=255,
        default="HealthInfo",
        help_text=_("The name of the website")
    )
    
    site_description = models.TextField(
        default="Trusted source for medical information, health conditions, symptoms, treatments, and wellness advice.",
        help_text=_("A brief description of the website")
    )
    
    site_logo = models.ForeignKey(
        get_image_model_string(),
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+',
        help_text=_("The site logo")
    )
    
    favicon = models.ForeignKey(
        get_image_model_string(),
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+',
        help_text=_("The favicon (16x16 or 32x32 pixels)")
    )
    
    medical_disclaimer = RichTextField(
        default="The content on this site is for informational purposes only and is not intended to be a substitute for professional medical advice, diagnosis, or treatment.",
        help_text=_("Medical disclaimer text displayed throughout the site")
    )
    
    panels = [
        FieldPanel('site_name'),
        FieldPanel('site_description'),
        FieldPanel('site_logo'),
        FieldPanel('favicon'),
        FieldPanel('medical_disclaimer'),
    ]
    
    class Meta:
        verbose_name = "Site Settings"
