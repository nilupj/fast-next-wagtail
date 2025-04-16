from django.conf import settings
from django.urls import include, path
from django.contrib import admin
from django.conf.urls.static import static

from wagtail.admin import urls as wagtailadmin_urls
from wagtail import urls as wagtail_urls
from wagtail.documents import urls as wagtaildocs_urls
from wagtail.contrib.sitemaps.views import sitemap

from . import api
from search import views as search_views

urlpatterns = [
    path('django-admin/', admin.site.urls),
    path('admin/', include(wagtailadmin_urls)),
    path('documents/', include(wagtaildocs_urls)),
    path('search/', search_views.search, name='search'),
    
    # API URLs
    path('api/v2/', api.api_router.urls),
    # Import the API views directly to avoid module errors
    # The endpoints are defined in the main api.py file
    path('api/', include([
        # Article endpoints
        path('articles/top-stories', api.articles_top_stories, name='articles_top_stories'),
        path('articles/health-topics', api.articles_health_topics, name='articles_health_topics'),
        path('articles/paths', api.articles_paths, name='articles_paths'),
        path('articles/<slug:slug>', api.article_detail, name='article_detail'),
        path('articles/<slug:slug>/related', api.article_related, name='article_related'),
        path('articles/search', api.search_articles, name='search_articles'),
        
        # Condition endpoints
        path('conditions/index', api.conditions_index, name='conditions_index'),
        path('conditions/paths', api.conditions_paths, name='conditions_paths'),
        path('conditions/<slug:slug>', api.condition_detail, name='condition_detail'),
        path('conditions/search', api.search_conditions, name='search_conditions'),
        
        # Well-being endpoint
        path('well-being', api.well_being, name='well_being'),
    ])),
    
    # Sitemap
    path('sitemap.xml', sitemap),
]

if settings.DEBUG:
    # Serve static and media files during development
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    
    # Debug toolbar
    try:
        import debug_toolbar
        urlpatterns += [
            path('__debug__/', include(debug_toolbar.urls)),
        ]
    except ImportError:
        pass

# Add Wagtail URLs at the end
urlpatterns += [
    path('', include(wagtail_urls)),
]
