from django.db import models

from wagtail.models import Page
from wagtail.fields import RichTextField
from wagtail.admin.panels import FieldPanel


class HomePage(Page):
    """
    The main homepage for the site.
    """
    body = RichTextField(blank=True)
    
    content_panels = Page.content_panels + [
        FieldPanel('body'),
    ]
    
    subpage_types = ['articles.ArticleIndexPage', 'conditions.ConditionIndexPage']