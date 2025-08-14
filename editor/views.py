import os
import json
from typing import Any, Dict

import requests
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt


def index(request: HttpRequest) -> HttpResponse:
    return render(request, 'editor/index.html')


@csrf_exempt
def bee_auth(request: HttpRequest) -> JsonResponse:
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    bee_client_id = os.environ.get('BEE_CLIENT_ID')
    bee_client_secret = os.environ.get('BEE_CLIENT_SECRET')
    if not bee_client_id or not bee_client_secret:
        return JsonResponse({'error': 'Server not configured'}, status=500)

    try:
        payload: Dict[str, Any] = json.loads(request.body.decode('utf-8') or '{}')
    except Exception:
        payload = {}
    uid = payload.get('uid') if isinstance(payload, dict) else None

    try:
        resp = requests.post(
            'https://auth.getbee.io/loginV2',
            json={
                'client_id': bee_client_id,
                'client_secret': bee_client_secret,
                'uid': uid or 'demo-user',
            },
            headers={'Content-Type': 'application/json'},
            timeout=15,
        )
        resp.raise_for_status()
        data = resp.json()
        return JsonResponse(data)
    except requests.HTTPError as e:  # type: ignore
        return JsonResponse({'error': 'Failed to authenticate', 'details': str(e)}, status=resp.status_code if 'resp' in locals() else 500)
    except Exception as e:  # type: ignore
        return JsonResponse({'error': 'Unexpected error', 'details': str(e)}, status=500)


