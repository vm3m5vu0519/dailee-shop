from django.shortcuts import render
import hashlib
import json
from django.http import JsonResponse
from users.models import UserProfile
from users.views import make_token


# Create your views here.


def tokens(request):
    data = json.loads(request.body)
    username = data.get('username')
    password = data.get('password')

    print('username:', username, 'password:', password)

    if not username or not password:
        return JsonResponse({
            "code": 400,
            "error": "請求數據有誤",
        })

    try:
        user = UserProfile.objects.get(username=username)
    except Exception as e:
        print(e)
        return JsonResponse({
            "code": 400,
            "error": "用戶不存在"
        })

    print(user.password)

    m = hashlib.md5()
    m.update(password.encode())
    print(m.hexdigest())
    if m.hexdigest() != user.password:
        return JsonResponse({
            "code": 400,
            "error": "密碼錯誤"
        })

    token = make_token(username)

    return JsonResponse({
        "code": 200,
        "username": username,
        "token": token.decode(),
        "carts_count": 0
    })
