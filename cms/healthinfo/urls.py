from django.conf import settings
from django.urls import include, path
from django.contrib import admin
from django.conf.urls.static import static

from wagtail.admin import urls as wagtailadmin_urls
from wagtail import urls as wagtail_urls
from wagtail.documents import urls as wagtaildocs_urls
from wagtail.contrib.sitemaps.views import sitemap

from .api import api_router
from search import views as search_views

urlpatterns = [
    path('django-admin/', admin.site.urls),
    path('admin/', include(wagtailadmin_urls)),
    path('documents/', include(wagtaildocs_urls)),
    path('search/', search_views.search, name='search'),
    
    # API URLs
    path('api/v2/', api_router.urls),
    path('api/', include('api.urls')),
    
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
