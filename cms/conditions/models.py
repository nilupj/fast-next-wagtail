from django.db import models
from django import forms
from django.core.paginator import EmptyPage, PageNotAnInteger, Paginator
from django.utils.translation import gettext_lazy as _

from wagtail.models import Page, Orderable
from wagtail.fields import RichTextField
from wagtail.admin.panels import FieldPanel, InlinePanel, MultiFieldPanel
from wagtail.search import index
from wagtail.snippets.models import register_snippet
from wagtail.images import get_image_model_string
from wagtail.api import APIField

from modelcluster.fields import ParentalKey, ParentalManyToManyField


class ConditionIndexPage(Page):
    """
    Index page for health conditions, which displays all available conditions.
    """
    intro = RichTextField(blank=True)
    
    content_panels = Page.content_panels + [
        FieldPanel('intro')
    ]
    
    subpage_types = ['conditions.ConditionPage']
    parent_page_types = ['home.HomePage']
    
    def get_context(self, request):
        context = super().get_context(request)
        
        # Filter the conditions (A-Z)
        letter = request.GET.get('letter', 'A')
        conditions = ConditionPage.objects.child_of(self).live()
        
        if letter:
            conditions = conditions.filter(title__istartswith=letter)
        
        # Pagination
        page = request.GET.get('page')
        paginator = Paginator(conditions, 24)  # Show 24 conditions per page
        
        try:
            conditions = paginator.page(page)
        except PageNotAnInteger:
            conditions = paginator.page(1)
        except EmptyPage:
            conditions = paginator.page(paginator.num_pages)
            
        context['conditions'] = conditions
        context['current_letter'] = letter
        return context
    
    class Meta:
        verbose_name = "Condition Index Page"


@register_snippet
class ConditionCategory(models.Model):
    """
    Category for categorizing ConditionPage
    """
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, max_length=255)
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
    This allows the addition of related conditions to a ConditionPage.
    """
    page = ParentalKey('conditions.ConditionPage', related_name='related_conditions')
    related_condition = models.ForeignKey(
        'conditions.ConditionPage',
        on_delete=models.CASCADE,
        related_name='+'
    )
    
    panels = [
        FieldPanel('related_condition'),
    ]


class ConditionPage(Page):
    """
    A page for a health condition with detailed information.
    """
    subtitle = models.CharField(max_length=255, blank=True)
    
    image = models.ForeignKey(
        get_image_model_string(),
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )
    
    also_known_as = models.CharField(max_length=255, blank=True)
    
    overview = RichTextField(
        help_text=_("General description of the condition")
    )
    
    symptoms = RichTextField(
        help_text=_("Common symptoms associated with this condition")
    )
    
    causes = RichTextField(
        help_text=_("Causes and risk factors for this condition")
    )
    
    diagnosis = RichTextField(
        help_text=_("How the condition is diagnosed")
    )
    
    treatments = RichTextField(
        help_text=_("Treatment options for this condition")
    )
    
    prevention = RichTextField(
        help_text=_("Prevention measures for this condition"),
        blank=True
    )
    
    complications = RichTextField(
        help_text=_("Possible complications related to this condition"),
        blank=True
    )

    specialties = models.CharField(
        max_length=255,
        blank=True,
        help_text=_("Medical specialties that treat this condition")
    )
    
    prevalence = models.CharField(
        max_length=255,
        blank=True,
        help_text=_("How common the condition is")
    )
    
    risk_factors = models.TextField(
        blank=True,
        help_text=_("Factors that may increase risk of developing this condition")
    )
    
    categories = ParentalManyToManyField('conditions.ConditionCategory', blank=True)
    
    view_count = models.PositiveIntegerField(default=0)
    
    def increase_view_count(self):
        """
        Increase the view count for this condition.
        """
        self.view_count += 1
        self.save(update_fields=['view_count'])
    
    content_panels = Page.content_panels + [
        FieldPanel('subtitle'),
        FieldPanel('image'),
        FieldPanel('also_known_as'),
        MultiFieldPanel([
            FieldPanel('overview'),
            FieldPanel('symptoms'),
            FieldPanel('causes'),
            FieldPanel('diagnosis'),
            FieldPanel('treatments'),
            FieldPanel('prevention'),
            FieldPanel('complications'),
        ], heading="Condition Information"),
        MultiFieldPanel([
            FieldPanel('specialties'),
            FieldPanel('prevalence'),
            FieldPanel('risk_factors'),
            FieldPanel('categories', widget=forms.CheckboxSelectMultiple),
        ], heading="Additional Information"),
        InlinePanel('related_conditions', label="Related Conditions"),
    ]
    
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
    
    parent_page_types = ['conditions.ConditionIndexPage']
    subpage_types = []
    
    def get_context(self, request):
        context = super().get_context(request)
        
        # Increase view count
        self.increase_view_count()
        
        # Get related articles
        from articles.models import ArticlePage
        related_articles = ArticlePage.objects.live()
        
        # Look for articles that mention this condition
        condition_name = self.title.lower()
        related_articles = related_articles.filter(
            models.Q(title__icontains=condition_name) | 
            models.Q(subtitle__icontains=condition_name) | 
            models.Q(body__icontains=condition_name)
        )
        
        # Sort by most relevant (most mentions of the condition name)
        related_articles = related_articles.order_by('-first_published_at')[:3]
        context['related_articles'] = related_articles
        
        return context
    
    class Meta:
        verbose_name = "Condition Page"


class ConditionListingPage(Page):
    """
    A page that lists conditions by a particular category
    """
    intro = RichTextField(blank=True)
    
    filter_type = models.CharField(
        max_length=20,
        choices=[
            ('category', 'Category'),
            ('popular', 'Popular'),
            ('alphabetical', 'Alphabetical'),
        ],
        default='alphabetical'
    )
    
    category = models.ForeignKey(
        'conditions.ConditionCategory',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )
    
    content_panels = Page.content_panels + [
        FieldPanel('intro'),
        FieldPanel('filter_type'),
        FieldPanel('category'),
    ]
    
    def get_context(self, request):
        context = super().get_context(request)
        
        conditions = ConditionPage.objects.live()
        
        if self.filter_type == 'category' and self.category:
            conditions = conditions.filter(categories=self.category)
            context['filter_title'] = f"Category: {self.category.name}"
        
        elif self.filter_type == 'popular':
            conditions = conditions.order_by('-view_count')
            context['filter_title'] = "Popular Conditions"
        
        else:  # alphabetical
            letter = request.GET.get('letter', 'A')
            conditions = conditions.filter(title__istartswith=letter)
            context['filter_title'] = f"Conditions: {letter}"
            context['current_letter'] = letter
        
        # Pagination
        page = request.GET.get('page')
        paginator = Paginator(conditions, 24)  # Show 24 conditions per page
        
        try:
            conditions = paginator.page(page)
        except PageNotAnInteger:
            conditions = paginator.page(1)
        except EmptyPage:
            conditions = paginator.page(paginator.num_pages)
            
        context['conditions'] = conditions
        return context
    
    class Meta:
        verbose_name = "Condition Listing Page"
