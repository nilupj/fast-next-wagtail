
from django.http import JsonResponse
from wagtail.models import Page
from articles.models import ArticlePage
from conditions.models import ConditionPage
from drugs.models import DrugPage

def search(request):
    search_query = request.GET.get('q', '')
    
    if not search_query:
        return JsonResponse({
            'articles': [],
            'conditions': [], 
            'drugs': []
        })

    # Search articles
    article_results = ArticlePage.objects.live().search(search_query)
    articles = [{
        'id': article.id,
        'title': article.title,
        'slug': article.slug,
        'summary': article.subtitle if hasattr(article, 'subtitle') else '',
        'category': article.categories.first().name if hasattr(article, 'categories') and article.categories.exists() else None,
        'image': article.image.get_rendition('fill-800x500').url if hasattr(article, 'image') and article.image else None,
        'created_at': article.first_published_at,
    } for article in article_results]

    # Search conditions
    condition_results = ConditionPage.objects.live().search(search_query)
    conditions = [{
        'id': condition.id,
        'name': condition.title,
        'slug': condition.slug,
        'subtitle': condition.subtitle if hasattr(condition, 'subtitle') else '',
    } for condition in condition_results]

    # Search drugs
    drug_results = DrugPage.objects.live().search(search_query)
    drugs = [{
        'id': drug.id,
        'name': drug.title,
        'slug': drug.slug,
        'type': drug.drug_type if hasattr(drug, 'drug_type') else '',
    } for drug in drug_results]

    return JsonResponse({
        'articles': articles,
        'conditions': conditions,
        'drugs': drugs
    })
