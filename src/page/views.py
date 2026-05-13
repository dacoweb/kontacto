# -*- coding: utf-8 -*-
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.http import require_http_methods
from django.core.validators import validate_email
from django.core.exceptions import ValidationError

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
    try:
        body = json.loads(request.body)

        name = body.get('name', '').strip()
        email = body.get('email', '').strip()
        subject = body.get('subject', '').strip()
        message = body.get('message', '').strip()

        errors = {}

        if not name:
            errors['name'] = 'El nombre es requerido.'
        if not email:
            errors['email'] = 'El email es requerido.'
        else:
            try:
                validate_email(email)
            except ValidationError:
                errors['email'] = 'El email no es válido.'
        if not subject:
            errors['subject'] = 'El asunto es requerido.'
        if not message:
            errors['message'] = 'El mensaje es requerido.'

        if errors:
            return JsonResponse({
                'stored': False,
                'errors': errors
            }, status=400)

        Contact.objects.create(**body)
        return JsonResponse({'stored': True})
    except IntegrityError:
        print("Fallo, registrar log de ser necesario.")
    return JsonResponse({'stored': False})
