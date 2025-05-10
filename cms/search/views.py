
from django.core.paginator import EmptyPage, PageNotAnInteger, Paginator
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
        'summary': article.subtitle,
        'category': article.categories.first().name if article.categories.exists() else None,
        'created_at': article.first_published_at,
    } for article in article_results]

    # Search conditions
    condition_results = ConditionPage.objects.live().search(search_query)
    conditions = [{
        'id': condition.id,
        'name': condition.title,
        'slug': condition.slug,
        'subtitle': condition.subtitle,
    } for condition in condition_results]

    # Search drugs
    drug_results = DrugPage.objects.live().search(search_query)
    drugs = [{
        'id': drug.id,
        'name': drug.title,
        'slug': drug.slug,
        'type': drug.drug_type,
    } for drug in drug_results]

    return JsonResponse({
        'articles': articles,
        'conditions': conditions,
        'drugs': drugs
    })
