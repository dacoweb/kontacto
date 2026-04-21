# -*- coding: utf-8 -*-
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.http import require_http_methods
from page.models import Contact


@require_http_methods(["GET"])
def page_home(request):
    return render(request, 'page/home.html')


@csrf_exempt
@require_http_methods(["GET"])
def list(request):
    data = [] # list([]) # Contact.objects.get()
    return JsonResponse(data, safe=False)


@csrf_exempt
@require_http_methods(["POST"])
def store(request):
    body = json.loads(request.body)
    # Contact.objects.create(**body)
    return JsonResponse({'ok': True})
    # return JsonResponse({'ok': True})
