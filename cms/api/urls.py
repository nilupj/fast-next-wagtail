from django.urls import path
from api import views

# Import the custom API views from the main api.py
from api import (
    articles_top_stories, articles_health_topics, articles_paths,
    article_detail, article_related, conditions_index, conditions_paths,
    condition_detail, search_articles, search_conditions, well_being
)

urlpatterns = [
    # Article endpoints
    path('articles/top-stories', articles_top_stories, name='articles_top_stories'),
    path('articles/health-topics', articles_health_topics, name='articles_health_topics'),
    path('articles/paths', articles_paths, name='articles_paths'),
    path('articles/<slug:slug>', article_detail, name='article_detail'),
    path('articles/<slug:slug>/related', article_related, name='article_related'),
    path('articles/search', search_articles, name='search_articles'),
    
    # Condition endpoints
    path('conditions/index', conditions_index, name='conditions_index'),
    path('conditions/paths', conditions_paths, name='conditions_paths'),
    path('conditions/<slug:slug>', condition_detail, name='condition_detail'),
    path('conditions/search', search_conditions, name='search_conditions'),
    
    # Well-being endpoint
    path('well-being', well_being, name='well_being'),
]