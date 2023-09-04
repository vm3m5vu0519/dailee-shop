import jwt
from django.conf import settings
from django.http import JsonResponse
from users.models import UserProfile


def logging_check(func):
    def warpper(self, request, *args, **kwargs):
        token = request.META.get('HTTP_AUTHORIZATION',None)
        if not token:
            return JsonResponse({
                'code': 403,
                'error': " 會員未登錄 "
            })
        try:
            payload = jwt.decode(token, settings.JWT_TOKEN_KEY, algorithms='HS256')
        except Exception as e:
            print(e)
            return JsonResponse({
                'code': 403,
                'error': "驗證碼失敗,請重新登錄"
            })
        # {"username":xxx,"exp":xxx}
        username = payload['username']
        user = UserProfile.objects.get(username=username)
        request.myuser = user

        return func(self, request, *args, **kwargs)

    return warpper
