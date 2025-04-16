from django.db import models
from django import forms

from modelcluster.fields import ParentalKey
from modelcluster.models import ClusterableModel

from wagtail.models import Page, Orderable
from wagtail.fields import RichTextField
from wagtail.admin.panels import FieldPanel, InlinePanel, MultiFieldPanel
from wagtail.search import index
from wagtail.api import APIField

# For simplicity, we're creating minimal models to make the CMS work
# These will be expanded with more fields later

class ConditionIndexPage(Page):
    """
    A page that lists all health conditions
    """
    intro = RichTextField(blank=True)
    
    content_panels = Page.content_panels + [
        FieldPanel('intro'),
    ]
    
    # Parent/child page type rules
    parent_page_types = ['home.HomePage']
    subpage_types = ['conditions.ConditionPage', 'conditions.ConditionListingPage']
    
    class Meta:
        verbose_name = "Condition Index Page"


class ConditionListingPage(Page):
    """
    A page that lists conditions by category
    """
    intro = RichTextField(blank=True)
    
    content_panels = Page.content_panels + [
        FieldPanel('intro'),
    ]
    
    # Parent/child page type rules
    parent_page_types = ['conditions.ConditionIndexPage']
    subpage_types = []
    
    class Meta:
        verbose_name = "Condition Listing Page"


class ConditionCategory(models.Model):
    """
    Category for health conditions
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
        verbose_name = "Condition Category"
        verbose_name_plural = "Condition Categories"


class RelatedConditionsOrderable(Orderable):
    """
    This allows us to select one or more related conditions
    """
    page = ParentalKey(
        'ConditionPage',
        related_name='related_conditions',
        on_delete=models.CASCADE
    )
    related_condition = models.ForeignKey(
        'conditions.ConditionPage',
        on_delete=models.CASCADE,
        related_name='+'
    )
    
    panels = [
        FieldPanel('related_condition'),
    ]
    
    api_fields = [
        APIField('related_condition'),
    ]


class ConditionPage(Page):
    """
    A page for a single health condition
    """
    subtitle = models.CharField(max_length=255, blank=True)
    also_known_as = models.CharField(max_length=255, blank=True)
    overview = RichTextField()
    symptoms = RichTextField()
    causes = RichTextField()
    diagnosis = RichTextField()
    treatments = RichTextField()
    prevention = RichTextField()
    complications = RichTextField(blank=True)
    risk_factors = RichTextField(blank=True)
    specialties = models.CharField(max_length=255, blank=True)
    prevalence = models.CharField(max_length=255, blank=True)
    image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )
    categories = models.ManyToManyField(
        ConditionCategory,
        blank=True,
        related_name='conditions'
    )
    view_count = models.PositiveIntegerField(default=0)
    
    # Search index configuration
    search_fields = Page.search_fields + [
        index.SearchField('title'),
        index.SearchField('subtitle'),
        index.SearchField('also_known_as'),
        index.SearchField('overview'),
        index.SearchField('symptoms'),
        index.SearchField('causes'),
        index.SearchField('diagnosis'),
        index.SearchField('treatments'),
        index.SearchField('prevention'),
        index.SearchField('complications'),
        index.SearchField('specialties'),
    ]
    
    # API fields for the API
    api_fields = [
        APIField('title'),
        APIField('subtitle'),
        APIField('image'),
        APIField('also_known_as'),
        APIField('overview'),
        APIField('symptoms'),
        APIField('causes'),
        APIField('diagnosis'),
        APIField('treatments'),
        APIField('prevention'),
        APIField('complications'),
        APIField('specialties'),
        APIField('prevalence'),
        APIField('risk_factors'),
        APIField('categories'),
        APIField('related_conditions'),
        APIField('view_count'),
    ]
    
    # Editor panels configuration
    content_panels = Page.content_panels + [
        FieldPanel('subtitle'),
        FieldPanel('also_known_as'),
        FieldPanel('image'),
        MultiFieldPanel([
            FieldPanel('overview'),
            FieldPanel('symptoms'),
            FieldPanel('causes'),
            FieldPanel('diagnosis'),
            FieldPanel('treatments'),
            FieldPanel('prevention'),
        ], heading="Core Information"),
        MultiFieldPanel([
            FieldPanel('complications'),
            FieldPanel('risk_factors'),
            FieldPanel('specialties'),
            FieldPanel('prevalence'),
        ], heading="Additional Information"),
        FieldPanel('categories', widget=forms.CheckboxSelectMultiple),
        InlinePanel('related_conditions', label="Related Conditions"),
    ]
    
    # Parent/child page type rules
    parent_page_types = ['conditions.ConditionIndexPage']
    subpage_types = []
    
    def increase_view_count(self):
        """
        Increment the view count for this condition
        """
        self.view_count += 1
        self.save()
    
    class Meta:
        verbose_name = "Condition Page"