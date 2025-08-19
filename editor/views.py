import os
import json

import requests
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.shortcuts import render


def index(request: HttpRequest) -> HttpResponse:
    return render(request, 'editor/index.html')


def bee_auth(request: HttpRequest) -> JsonResponse:
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    bee_client_id = os.environ.get('BEE_CLIENT_ID')
    bee_client_secret = os.environ.get('BEE_CLIENT_SECRET')
    if not all([bee_client_id, bee_client_secret]):
        return JsonResponse({'error': 'Server not configured'}, status=500)

    payload = json.loads(request.body.decode('utf-8') or '{}')
    uid = payload.get('uid', 'demo-user')

    try:
        auth_response = requests.post(
            'https://auth.getbee.io/loginV2',
            json={
                'client_id': bee_client_id,
                'client_secret': bee_client_secret,
                'uid': uid,
            },
            headers={'Content-Type': 'application/json'},
            timeout=15,
        )
        auth_response.raise_for_status()
        return JsonResponse(auth_response.json())
    except requests.HTTPError as e:
        status_code = auth_response.status_code if 'auth_response' in locals() else 500
        return JsonResponse({'error': 'Failed to authenticate', 'details': str(e)}, status=status_code)
    except Exception as e:
        return JsonResponse({'error': 'Unexpected error', 'details': str(e)}, status=500)


