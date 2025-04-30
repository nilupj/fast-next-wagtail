from .base import *

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-dev-key-change-in-production'

# SECURITY WARNING: define the correct hosts in production!
ALLOWED_HOSTS = ['*']
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True 

# Database
# https://docs.djangoproject.com/en/stable/ref/settings/#databases
import os
import dj_database_url

DATABASES = {
    'default': dj_database_url.config(
        default=os.environ.get('DATABASE_URL', 'postgresql://neondb_owner:npg_ajyx3ZVSs9Fm@ep-billowing-shape-a6scej6m.us-west-2.aws.neon.tech/neondb?sslmode=require'),
        conn_max_age=600,
        conn_health_checks=True,
    )
}

# Email settings
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# Enable media serving
# Note: django.contrib.staticfiles is already in INSTALLED_APPS in base.py

# Add debug toolbar
try:
    import debug_toolbar
    INSTALLED_APPS += [
        'debug_toolbar',
    ]
    MIDDLEWARE += [
        'debug_toolbar.middleware.DebugToolbarMiddleware',
    ]
    INTERNAL_IPS = ["127.0.0.1"]
except ImportError:
    pass

# CORS and CSRF settings
CORS_ALLOW_ALL_ORIGINS = True
CSRF_TRUSTED_ORIGINS = [
    'https://*.replit.dev',
    'https://*.replit.dev:3000',
    'https://*.replit.dev:8000',
    'https://*.replit.dev:8001'
]
WAGTAILAPI_BASE_URL = 'http://localhost:8001'
