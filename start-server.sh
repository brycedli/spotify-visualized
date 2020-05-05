#!/bin/bash
###!/usr/bin/env bash

if [ -n "$DJANGO_SUPERUSER_USERNAME" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ] ; then
    (cd django-spotify; python manage.py createsuperuser --no-input)
fi
# (cd django-spotify; gunicorn wsgi --user www-data --bind 0.0.0.0:8010 --workers 4 --keep-alive 650) &
# nginx -g "daemon off;"
(cd django-spotify; uwsgi --ini spotify_uwsgi.ini ) &
# cd django-spotify
# uwsgi --protocol http --socket /opt/app/mysite.sock --processes 4 --chmod-socket=666 &
nginx -g "daemon off;"
# uwsgi --http :8000 --wsgi-file ./django-spotify/manage.py runserver ddd