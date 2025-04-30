
from django.db import models
from wagtail.models import Page
from wagtail.fields import RichTextField
from wagtail.admin.panels import FieldPanel
from wagtail.api import APIField

class AppointmentPage(Page):
    intro = RichTextField(blank=True)
    description = RichTextField()
    booking_url = models.URLField(blank=True)
    contact_info = RichTextField(blank=True)
    terms = RichTextField(blank=True)
    
    content_panels = Page.content_panels + [
        FieldPanel('intro'),
        FieldPanel('description'),
        FieldPanel('booking_url'),
        FieldPanel('contact_info'),
        FieldPanel('terms'),
    ]

    api_fields = [
        APIField('intro'),
        APIField('description'),
        APIField('booking_url'),
        APIField('contact_info'),
        APIField('terms'),
    ]

    class Meta:
        verbose_name = "Appointment Page"
