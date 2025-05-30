from .base import *

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-dev-key-change-in-production'

# SECURITY WARNING: define the correct hosts in production!
ALLOWED_HOSTS = ['*'] 

# Database
# https://docs.djangoproject.com/en/stable/ref/settings/#databases
import os
from urllib.parse import urlparse

# Use DATABASE_URL from environment
DATABASE_URL = os.environ.get('DATABASE_URL')

if DATABASE_URL:
    # Parse the DATABASE_URL
    url = urlparse(DATABASE_URL)
    
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': url.path[1:],
            'USER': url.username,
            'PASSWORD': url.password,
            'HOST': url.hostname,
            'PORT': url.port or '5432',
        }
    }
else:
    # Fallback to SQLite if DATABASE_URL is not set
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
        }
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
