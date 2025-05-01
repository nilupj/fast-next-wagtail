from django.urls import path
from django.http import JsonResponse, Http404
from wagtail.models import Page
from wagtail.api.v2.views import PagesAPIViewSet
from wagtail.api.v2.router import WagtailAPIRouter
from wagtail.images.api.v2.views import ImagesAPIViewSet
from wagtail.documents.api.v2.views import DocumentsAPIViewSet
from articles.models import ArticlePage
from conditions.models import ConditionPage
# Hypothetical model, replace with your actual model
from drugs.models import DrugPage


api_router = WagtailAPIRouter('wagtailapi')
api_router.register_endpoint('pages', PagesAPIViewSet)
api_router.register_endpoint('images', ImagesAPIViewSet)
api_router.register_endpoint('documents', DocumentsAPIViewSet)

def get_translated_content(page, lang='en'):
    """Helper function to get translated content"""
    data = {
        'id': page.id,
        'title': page.title,
        'slug': page.slug,
        'url': page.url,
    }

    # Add translated fields based on model type
    if isinstance(page, ArticlePage):
        data.update({
            'subtitle': page.subtitle_hi if lang == 'hi' else page.subtitle,
            'summary': page.summary_hi if lang == 'hi' else page.summary,
            'body': page.body_hi if lang == 'hi' else page.body,
            'author': str(page.author) if page.author else None,
            'category': str(page.category) if page.category else None,
            'image': page.image.get_rendition('fill-800x500').url if page.image else None,
        })
    elif isinstance(page, ConditionPage):
        data.update({
            'subtitle': page.subtitle_hi if lang == 'hi' else page.subtitle,
            'also_known_as': page.also_known_as_hi if lang == 'hi' else page.also_known_as,
            'overview': page.overview_hi if lang == 'hi' else page.overview,
            'symptoms': page.symptoms_hi if lang == 'hi' else page.symptoms,
            'causes': page.causes_hi if lang == 'hi' else page.causes,
            'diagnosis': page.diagnosis_hi if lang == 'hi' else page.diagnosis,
            'treatments': page.treatments_hi if lang == 'hi' else page.treatments,
            'prevention': page.prevention_hi if lang == 'hi' else page.prevention,
            'complications': page.complications,
            'risk_factors': page.risk_factors,
            'specialties': page.specialties,
            'image': page.image.get_rendition('fill-800x500').url if page.image else None,
        })
    return data

def articles_top_stories(request):
    """Get top stories (featured articles)"""
    lang = request.GET.get('lang', 'en')
    articles = ArticlePage.objects.live().filter(featured=True).order_by('-first_published_at')[:6]
    return JsonResponse([get_translated_content(article, lang) for article in articles], safe=False)

def articles_health_topics(request):
    """Get health topics articles"""
    lang = request.GET.get('lang', 'en')
    articles = ArticlePage.objects.live().order_by('-first_published_at')[:12]
    return JsonResponse([get_translated_content(article, lang) for article in articles], safe=False)

def articles_paths(request):
    """Get all article slugs for static path generation"""
    paths = ArticlePage.objects.live().values_list('slug', flat=True)
    return JsonResponse(list(paths), safe=False)

def article_detail(request, slug):
    """Get a single article by its slug"""
    lang = request.GET.get('lang', 'en')
    try:
        article = ArticlePage.objects.live().get(slug=slug)
        return JsonResponse(get_translated_content(article, lang))
    except ArticlePage.DoesNotExist:
        raise Http404("Article not found")

def article_related(request, slug):
    """Get articles related to the specified article"""
    lang = request.GET.get('lang', 'en')
    try:
        article = ArticlePage.objects.live().get(slug=slug)
        related = ArticlePage.objects.live().exclude(id=article.id).order_by('?')[:3]
        return JsonResponse([get_translated_content(a, lang) for a in related], safe=False)
    except ArticlePage.DoesNotExist:
        return JsonResponse([], safe=False)

def conditions_index(request):
    """Retrieve a complete index of all health conditions"""
    lang = request.GET.get('lang', 'en')
    conditions = ConditionPage.objects.live().order_by('title')
    return JsonResponse([get_translated_content(condition, lang) for condition in conditions], safe=False)

def get_drugs_index(request):
    """Retrieve a complete index of all drugs"""
    lang = request.GET.get('lang', 'en')
    drugs = DrugPage.objects.live().order_by('title') # Hypothetical implementation
    return JsonResponse([get_translated_content(drug, lang) for drug in drugs], safe=False)


def get_drugs_index(request):
    """Retrieve a complete index of all drugs"""
    lang = request.GET.get('lang', 'en')
    drugs = DrugPage.objects.live().order_by('title')
    return JsonResponse([{
        'id': drug.id,
        'name': drug.title,
        'slug': drug.slug,
        'type': drug.drug_class,
        'generic_name': drug.generic_name,
        'brand_names': drug.brand_names
    } for drug in drugs], safe=False)

urlpatterns = [
    path('articles/index', articles_top_stories),
    path('articles/paths', articles_paths),
    path('drugs/index/', get_drugs_index),  # Updated with trailing slash
    path('articles/<slug>/', article_detail),
    path('articles/<slug>/related', article_related),
    path('conditions/index', conditions_index),
    path('articles/health_topics', articles_health_topics),
]