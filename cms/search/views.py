
from django.http import JsonResponse
from django.db.models import Q
from wagtail.models import Page
from articles.models import ArticlePage
from conditions.models import ConditionPage
from drugs.models import DrugPage

def search(request):
    search_query = request.GET.get('q', '').strip()
    
    if not search_query:
        return JsonResponse({
            'articles': [],
            'conditions': [], 
            'drugs': []
        })

    try:
        # Search articles with Q objects for better matching
        article_results = ArticlePage.objects.live().filter(
            Q(title__icontains=search_query) |
            Q(subtitle__icontains=search_query) |
            Q(body__icontains=search_query)
        ).distinct()

        articles = [{
            'id': article.id,
            'title': article.title,
            'slug': article.slug,
            'summary': getattr(article, 'subtitle', ''),
            'category': article.categories.first().name if hasattr(article, 'categories') and article.categories.exists() else None,
            'image': article.image.get_rendition('fill-800x500').url if hasattr(article, 'image') and article.image else None,
            'created_at': article.first_published_at,
        } for article in article_results]

        # Search conditions
        condition_results = ConditionPage.objects.live().filter(
            Q(title__icontains=search_query) |
            Q(subtitle__icontains=search_query)
        ).distinct()

        conditions = [{
            'id': condition.id,
            'name': condition.title,
            'slug': condition.slug,
            'subtitle': getattr(condition, 'subtitle', ''),
        } for condition in condition_results]

        # Search drugs
        drug_results = DrugPage.objects.live().filter(
            Q(title__icontains=search_query) |
            Q(drug_type__icontains=search_query)
        ).distinct()

        drugs = [{
            'id': drug.id,
            'name': drug.title,
            'slug': drug.slug,
            'type': getattr(drug, 'drug_type', ''),
        } for drug in drug_results]

        return JsonResponse({
            'articles': articles,
            'conditions': conditions,
            'drugs': drugs
        })
    except Exception as e:
        return JsonResponse({
            'error': str(e),
            'articles': [],
            'conditions': [],
            'drugs': []
        }, status=500)
