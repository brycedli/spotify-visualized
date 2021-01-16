import re,os
from datetime import datetime
from django.http import HttpResponse
from django.shortcuts import render
from django.shortcuts import redirect

from django.views.generic import ListView

client_id = os.environ.get('CLIENT_ID', '22ca38327ff8436cbf97e5979d2eb063')
redirect_uri = os.environ.get('REDIRECT_URI', 'http://brycedemos.com')

def token(request):
    return render(request, "spotme/token_proxy.html")

def visualize(request):
    return render(request, "spotme/visualize.html", context={
        "client_id": client_id,
        "redirect_uri": redirect_uri,
    })
