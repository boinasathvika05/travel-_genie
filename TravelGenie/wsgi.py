"""
WSGI config for TravelGenie project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'TravelGenie.settings')

application = get_wsgi_application()

# Run migrations automatically on Vercel if DATABASE_URL is provided
if os.environ.get('DATABASE_URL'):
    try:
        from django.core.management import call_command
        call_command('migrate', interactive=False)
        try:
            from seed_data import seed_data
            seed_data()
        except Exception:
            pass
    except Exception as e:
        print(f"Auto-migration notice: {e}")

app = application

