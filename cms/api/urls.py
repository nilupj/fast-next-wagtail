from django.urls import path

from . import views

urlpatterns = [
    # Articles
    path('articles/top-stories', views.articles_top_stories, name='articles_top_stories'),
    path('articles/health-topics', views.articles_health_topics, name='articles_health_topics'),
    path('articles/paths', views.articles_paths, name='articles_paths'),
    path('articles/<slug:slug>', views.article_detail, name='article_detail'),
    path('articles/<slug:slug>/related', views.article_related, name='article_related'),

    # Conditions
    path('conditions/index', views.conditions_index, name='conditions_index'),
    path('conditions/paths', views.conditions_paths, name='conditions_paths'),
    path('conditions/<slug:slug>', views.condition_detail, name='condition_detail'),

    # Search
    path('search/articles', views.search_articles, name='search_articles'),
    path('search/conditions', views.search_conditions, name='search_conditions'),

    # Well-being
    path('well-being', views.well_being, name='well_being'),
    #Symptom Checker
    path('symptom-checker/', views.symptom_checker, name='symptom_checker'),
    path('notifications/subscribe', views.notification_subscribe, name='notification_subscribe'),
    path('newsletter/subscribe', views.newsletter_subscribe, name='newsletter_subscribe'),
]