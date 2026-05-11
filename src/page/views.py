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


@require_http_methods(["GET"])
def list_contacts(request):
    data = list(Contact.objects.all().values('id', 'name', 'email', 'subject', 'message'))
    return JsonResponse(data, safe=False)


@csrf_exempt
@require_http_methods(["POST"])
def store_contact(request):
    body = json.loads(request.body)
    try:
        Contact.objects.create(**body)
        return JsonResponse({'stored': True})
    except IntegrityError:
        print("Fallo, registrar log de ser necesario.")
    return JsonResponse({'stored': False})
