from django.urls import path
from django.http import JsonResponse, Http404
from wagtail.models import Page
from wagtail.api.v2.views import PagesAPIViewSet
from wagtail.api.v2.router import WagtailAPIRouter
from wagtail.images.api.v2.views import ImagesAPIViewSet
from wagtail.documents.api.v2.views import DocumentsAPIViewSet

# Create the router
api_router = WagtailAPIRouter('wagtailapi')

# Register the endpoints
api_router.register_endpoint('pages', PagesAPIViewSet)
api_router.register_endpoint('images', ImagesAPIViewSet)
api_router.register_endpoint('documents', DocumentsAPIViewSet)

# Simplified API views for the FastAPI backend - no Query import
# We'll create simple placeholder functions to make the CMS start up

def articles_top_stories(request):
    """Get top stories (featured articles)"""
    return JsonResponse([], safe=False)

def articles_health_topics(request):
    """Get health topics articles"""
    return JsonResponse([], safe=False)

def articles_paths(request):
    """Get all article slugs for static path generation"""
    return JsonResponse([], safe=False)

def article_detail(request, slug):
    """Get a single article by its slug"""
    raise Http404("Article not found")

def article_related(request, slug):
    """Get articles related to the specified article"""
    return JsonResponse([], safe=False)

def conditions_index(request):
    """Retrieve a complete index of all health conditions"""
    return JsonResponse([], safe=False)

def conditions_paths(request):
    """Get all condition slugs for static path generation"""
    return JsonResponse([], safe=False)

def condition_detail(request, slug):
    """Get a single condition by its slug"""
    raise Http404("Condition not found")

def search_articles(request):
    """Search articles by query string"""
    return JsonResponse([], safe=False)

def search_conditions(request):
    """Search conditions by query string"""
    return JsonResponse([], safe=False)

def well_being(request):
    """Get articles for the well-being section"""
    return JsonResponse({
        'featured': [],
        'articles': []
    })