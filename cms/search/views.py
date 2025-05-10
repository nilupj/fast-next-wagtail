from django.core.paginator import EmptyPage, PageNotAnInteger, Paginator
from django.shortcuts import render

from wagtail.models import Page


def search(request):
    search_query = request.GET.get('query', None)
    page = request.GET.get('page', 1)

    # Search
    if search_query:
        # Search across different page types
        search_results = Page.objects.live().specific().search(search_query)
        for result in search_results:
            # Access specific fields for each page type
            result = result.specific
            # Add relevance score
            result.search_score = result.get_search_score()
        # Order by relevance
        search_results = sorted(search_results, key=lambda x: x.search_score if hasattr(x, 'search_score') else 0, reverse=True)
    else:
        search_results = Page.objects.none()

    # Pagination
    paginator = Paginator(search_results, 10)
    try:
        search_results = paginator.page(page)
    except PageNotAnInteger:
        search_results = paginator.page(1)
    except EmptyPage:
        search_results = paginator.page(paginator.num_pages)

    return render(request, 'search/search.html', {
        'search_query': search_query,
        'search_results': search_results,
    })