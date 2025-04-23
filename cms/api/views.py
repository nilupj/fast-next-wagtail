import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q

from wagtail.models import Page

from articles.models import ArticlePage, ArticleCategory
from conditions.models import ConditionPage, ConditionCategory


@csrf_exempt
def symptom_checker(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            age = data.get('age')
            gender = data.get('gender')
            symptoms = data.get('symptoms', [])

            # Mock response for demonstration
            conditions = [
                {
                    "name": "Common Cold",
                    "description": "A viral infection of the nose and throat",
                    "probability": 75.5,
                    "urgency": 1
                }
            ]

            return JsonResponse({
                "conditions": conditions,
                "disclaimer": "This is for informational purposes only."
            })
        except json.JSONDecodeError as e:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Method not allowed"}, status=405)


def articles_top_stories(request):
    """Get top stories (featured articles)"""
    try:
        articles = ArticlePage.objects.live().filter(featured=True).order_by('-first_published_at')[:5]

        response = []
        for article in articles:
            article_data = {
                'id': article.id,
                'title': article.title,
                'slug': article.slug,
                'summary': article.summary,
                'body': article.body,
                'image': request.build_absolute_uri(article.image.get_rendition('fill-800x500').url) if article.image else None,
                'author': {
                    'name': article.author.name,
                    'credentials': article.author.credentials,
                } if article.author else None,
                'category': {
                    'name': article.category.name,
                    'slug': article.category.slug,
                } if article.category else None,
                'created_at': article.first_published_at,
                'tags': [tag.name for tag in article.tags.all()],
            }
            response.append(article_data)

        return JsonResponse(response, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


def articles_health_topics(request):
    """Get health topics articles"""
    categories = ArticleCategory.objects.all()
    response = []

    for category in categories:
        articles = category.articles.live().order_by('-first_published_at')[:3]
        if articles:
            category_data = {
                'name': category.name,
                'slug': category.slug,
                'articles': []
            }

            for article in articles:
                article_data = {
                    'id': article.id,
                    'title': article.title,
                    'slug': article.slug,
                    'summary': article.summary,
                    'image': article.image.get_rendition('fill-800x500').url if article.image else None,
                    'created_at': article.first_published_at,
                }
                category_data['articles'].append(article_data)

            response.append(category_data)

    return JsonResponse(response, safe=False)


def articles_paths(request):
    """Get all article slugs for static path generation"""
    articles = ArticlePage.objects.live().values_list('slug', flat=True)
    return JsonResponse(list(articles), safe=False)


from urllib.parse import unquote

def article_detail(request, slug):
    """Get a single article by its slug"""
    try:
        # Decode the URL-encoded slug
        decoded_slug = unquote(slug.strip('/'))
        article = ArticlePage.objects.live().get(slug=decoded_slug)

        article_data = {
            'id': article.id,
            'title': article.title,
            'slug': article.slug,
            'subtitle': article.subtitle,
            'summary': article.summary,
            'content': article.body,
            'image': article.image.get_rendition('fill-800x500').url if article.image else None,
            'author': {
                'name': article.author.name,
                'credentials': article.author.credentials,
                'bio': article.author.bio,
                'image': article.author.image.get_rendition('fill-100x100').url if article.author and article.author.image else None,
            } if article.author else None,
            'category': {
                'name': article.category.name,
                'slug': article.category.slug,
            } if article.category else None,
            'tags': [tag.name for tag in article.tags.all()],
            'published_date': article.first_published_at,
            'updated_date': article.last_published_at if article.first_published_at != article.last_published_at else None,
        }

        # Update view count
        article.view_count += 1
        article.save()

        return JsonResponse(article_data)
    except ArticlePage.DoesNotExist:
        return JsonResponse({'message': 'Article not found'}, status=404)


def article_related(request, slug):
    """Get articles related to the specified article"""
    try:
        article = ArticlePage.objects.live().get(slug=slug)

        # Get articles with the same category or tags
        related_articles = ArticlePage.objects.live().filter(
            Q(category=article.category) | Q(tags__in=article.tags.all())
        ).exclude(id=article.id).distinct()[:3]

        response = []
        for related in related_articles:
            article_data = {
                'id': related.id,
                'title': related.title,
                'slug': related.slug,
                'summary': related.summary,
                'image': related.image.get_rendition('fill-800x500').url if related.image else None,
                'created_at': related.first_published_at,
            }
            response.append(article_data)

        return JsonResponse(response, safe=False)
    except ArticlePage.DoesNotExist:
        return JsonResponse([], safe=False)


def conditions_index(request):
    """Retrieve a complete index of all health conditions"""
    conditions = ConditionPage.objects.live().order_by('title')

    response = []
    for condition in conditions:
        condition_data = {
            'id': condition.id,
            'name': condition.title,
            'slug': condition.slug,
            'subtitle': condition.subtitle,
        }
        response.append(condition_data)

    return JsonResponse(response, safe=False)


def conditions_paths(request):
    """Get all condition slugs for static path generation"""
    conditions = ConditionPage.objects.live().values_list('slug', flat=True)
    return JsonResponse(list(conditions), safe=False)


def condition_detail(request, slug):
    """Get a single condition by its slug"""
    try:
        condition = ConditionPage.objects.live().get(slug=slug)

        lang = request.GET.get('lang', 'en')
        
        condition_data = {
            'id': condition.id,
            'name': condition.title,
            'slug': condition.slug,
            'subtitle': condition.subtitle_hi if lang == 'hi' else condition.subtitle,
            'overview': condition.overview_hi if lang == 'hi' else condition.overview,
            'symptoms': condition.symptoms_hi if lang == 'hi' else condition.symptoms,
            'causes': condition.causes_hi if lang == 'hi' else condition.causes,
            'diagnosis': condition.diagnosis_hi if lang == 'hi' else condition.diagnosis,
            'treatments': condition.treatments_hi if lang == 'hi' else condition.treatments,
            'prevention': condition.prevention_hi if lang == 'hi' else condition.prevention,
            'complications': condition.complications,
            'also_known_as': condition.also_known_as,
            'specialties': condition.specialties,
            'prevalence': condition.prevalence,
            'risk_factors': condition.risk_factors,
            'image': condition.image.get_rendition('fill-800x500').url if condition.image else None,
            'related_conditions': [
                {
                    'name': rc.related_condition.title,
                    'slug': rc.related_condition.slug,
                }
                for rc in condition.related_conditions.all()
            ],
        }

        # Update view count
        condition.view_count += 1
        condition.save()

        return JsonResponse(condition_data)
    except ConditionPage.DoesNotExist:
        return JsonResponse({'message': 'Condition not found'}, status=404)


def search_articles(request):
    """Search articles by query string"""
    query = request.GET.get('q', '')
    if not query:
        return JsonResponse([], safe=False)

    articles = ArticlePage.objects.live().search(query)

    response = []
    for article in articles:
        article_data = {
            'id': article.id,
            'title': article.title,
            'slug': article.slug,
            'summary': article.summary,
            'image': article.image.get_rendition('fill-800x500').url if article.image else None,
            'created_at': article.first_published_at,
        }
        response.append(article_data)

    return JsonResponse(response, safe=False)


def search_conditions(request):
    """Search conditions by query string"""
    query = request.GET.get('q', '')
    if not query:
        return JsonResponse([], safe=False)

    conditions = ConditionPage.objects.live().search(query)

    response = []
    for condition in conditions:
        condition_data = {
            'id': condition.id,
            'name': condition.title,
            'slug': condition.slug,
            'subtitle': condition.subtitle,
        }
        response.append(condition_data)

    return JsonResponse(response, safe=False)


def well_being(request):
    """Get articles for the well-being section"""
    categories = ['Nutrition', 'Fitness', 'Mental Health', 'Sleep', 'Stress Management', 'Healthy Aging']
    articles = ArticlePage.objects.live().filter(
        category__name__in=categories
    ).order_by('-first_published_at')

    featured_articles = articles.filter(featured=True)[:3]

    return JsonResponse({
        'featured': [{
            'id': article.id,
            'title': article.title,
            'slug': article.slug,
            'summary': article.summary,
            'image': article.image.get_rendition('fill-800x500').url if article.image else None,
            'category': article.category.name if article.category else None,
        } for article in featured_articles],
        'articles': [{
            'id': article.id,
            'title': article.title,
            'slug': article.slug,
            'summary': article.summary,
            'image': article.image.get_rendition('fill-800x500').url if article.image else None,
            'category': article.category.name if article.category else None,
        } for article in articles[:12]]
    })
from django.http import JsonResponse
from django.core.mail import send_mail
from django.conf import settings
from pywebpush import webpush, WebPushException
import json

def notification_subscribe(request):
    if request.method == 'POST':
        try:
            subscription_info = json.loads(request.body)
            # Store subscription info in database
            # Send confirmation push notification
            try:
                webpush(
                    subscription_info=subscription_info,
                    data="Thanks for subscribing to notifications!",
                    vapid_private_key=settings.VAPID_PRIVATE_KEY,
                    vapid_claims={"sub": "mailto:admin@healthinfo.com"}
                )
                return JsonResponse({"status": "success"})
            except WebPushException as e:
                return JsonResponse({"status": "error", "message": str(e)}, status=500)
        except json.JSONDecodeError:
            return JsonResponse({"status": "error", "message": "Invalid JSON"}, status=400)
    return JsonResponse({"status": "error", "message": "Method not allowed"}, status=405)

def newsletter_subscribe(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            if not email:
                return JsonResponse({"status": "error", "message": "Email required"}, status=400)

            # Store email in database
            # Send welcome email
            send_mail(
                'Welcome to Health Info Newsletter',
                'Thank you for subscribing to our newsletter!',
                'noreply@healthinfo.com',
                [email],
                fail_silently=False,
            )
            return JsonResponse({"status": "success"})
        except json.JSONDecodeError:
            return JsonResponse({"status": "error", "message": "Invalid JSON"}, status=400)
    return JsonResponse({"status": "error", "message": "Method not allowed"}, status=405)