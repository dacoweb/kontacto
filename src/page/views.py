# -*- coding: utf-8 -*-
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.http import require_http_methods
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.db import IntegrityError

from page.models import Contact


@require_http_methods(["GET"])
def page_home(request):
    return render(request, 'page/home.html')


@require_http_methods(["GET"])
def list_contacts(request):
    data = list(Contact.objects.all().order_by('-id').values('id', 'name', 'email', 'subject', 'message'))
    return JsonResponse(data, safe=False)


@require_http_methods(["POST"])
def store_contact(request):
    try:
        body = json.loads(request.body)

        name = body.get('name', '').strip()
        email = body.get('email', '').strip()
        subject = body.get('subject', '').strip()
        message = body.get('message', '').strip()
        messageContactId = body.get('messageContactId', '').strip()

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
        
        if messageContactId.isdigit() and int(messageContactId) > 0:
            Contact.objects.filter(id=messageContactId).update(
                name=name,
                email=email,
                subject=subject,
                message=message
            )
        else:
            newContact = {
                'name': name,
                'email': email,
                'subject': subject,
                'message': message
            }
            Contact.objects.create(**newContact)

        return JsonResponse({'stored': True})
    except IntegrityError as ie:
        print(f"Error de Integridad detectado: {ie}")
        print("Fallo, registrar log de ser necesario.")
    return JsonResponse({'stored': False})


@require_http_methods(["POST"])
def edit_contact(request):
    contactMessage = {}
    data = json.loads(request.body)
    id = data.get('id')
    if id:
        contact = Contact.objects.get(id=id)
        if contact:
            contactMessage['id'] = contact.id
            contactMessage['name'] = contact.name
            contactMessage['email'] = contact.email
            contactMessage['subject'] = contact.subject
            contactMessage['message'] = contact.message
    return JsonResponse(contactMessage, safe=False)


@require_http_methods(["POST"])
def delete_contact(request):
    data = json.loads(request.body)
    id = data.get('id')
    if id:
        contact = Contact.objects.get(id=id)
        if contact:
            contact.delete()
            return JsonResponse({'deleted': True})
    return JsonResponse({'deleted': False})