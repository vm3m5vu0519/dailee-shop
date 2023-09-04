import string
from django.db import transaction
import hashlib
import json
import jwt
import time
from django.views import View
from django.http import JsonResponse
from users.models import UserProfile, Address
from django.conf import settings
from utils.logging_dec import logging_check
from django.core.mail import send_mail
import random
from django.core.cache import cache


# Create your views here.

def make_token(username, exp=3600 * 24):
    payload = {
        'username': username,
        'exp': int(time.time() + exp),
    }
    key = settings.JWT_TOKEN_KEY
    return jwt.encode(payload, key, algorithm='HS256')


class RegisterView(View):
    def post(self, request):
        data = json.loads(request.body)
        email = data.get('email')
        verification_code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        cache.set(email, verification_code, timeout=300)

        send_mail(
            'DaiLee會員註冊驗證碼',
            '尊貴的客戶您好,請確認帳戶是否為本人並確保信箱的正確性,您的驗證碼是: {}'.format(verification_code),
            settings.EMAIL_HOST_USER,
            [email],
            fail_silently=False,
        )

        return JsonResponse({'code': 200, 'data': '驗證碼已寄出'})

    def put(self, request):
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        username = data.get('username')
        gender = data.get('gender')
        phone = data.get('phone')
        verification_code = data.get('verification_code')

        stored_code = cache.get(email)

        print('email:', email, 'password:', password, 'username:', username, 'gender:', gender, 'phone:', phone,
              'verification_code:', verification_code)

        old_user = UserProfile.objects.filter(email=email)
        if old_user:
            return JsonResponse({
                'code': 400,
                'error': '信箱已使用'
            })

        # if stored_code and stored_code.decode('utf-8') != verification_code:
        if stored_code != verification_code:
            return JsonResponse({
                'code': 400,
                'error': '驗證碼錯誤'
            })

        if not email or not password or not username or not gender or not phone:
            return JsonResponse({
                'code': 400,
                'error': '資料不能為空'
            })

        m = hashlib.md5()
        m.update(password.encode())
        new_password = m.hexdigest()

        try:
            UserProfile.objects.create(email=email, password=new_password, username=username, gender=gender,
                                       phone=phone)
        except Exception as e:
            print(e)
            return JsonResponse({
                'code': 400,
                'error': '保存失敗'
            })
        
        cache.delete(username)

        token = make_token(username)
        return JsonResponse({
            'code': 200,
            'user': username,
            'token': token.decode()
        })


class UserProfileView(View):
    @logging_check
    def get(self, request, username):
        user = request.myuser
        return JsonResponse(
            {'email': user.email, 'username': user.username, 'gender': user.gender,
             'phone': user.phone, 'date_of_birth': user.date_of_birth})

    @logging_check
    def post(self, request, username):
        user = request.myuser
        gender = request.POST.get('gender')
        phone = request.POST.get('phone')
        date_of_birth = request.POST.get('date_of_birth')

        user.gender = gender
        user.phone = phone
        user.date_of_birth = date_of_birth
        user.save()

        data = {'message': '修改成功'}
        return JsonResponse(data)

    @logging_check
    def put(self, request):
        user = request.myuser
        avatar = request.FILES.get('avatar')

        if not avatar:
            return JsonResponse({'code': 400, 'msg': '沒有上傳檔案'})
        if avatar.size > settings.MAX_UPLOAD_SIZE:
            return JsonResponse(
                {'code': 400, 'error': f'頭像超出容量上限 ({settings.MAX_UPLOAD_SIZE / 1024 / 1024} MB)'})
        user.avatar = avatar
        user.save()
        return JsonResponse({'code': 200, 'msg': '頭像上傳成功'})


class AddressView(View):
    @logging_check
    def get(self, request, username):
        user = request.myuser
        try:
            all_address = Address.objects.filter(user_profile=user, is_active=True)
        except Exception as e:
            print(e)
            return JsonResponse({
                'code': 403,
                'error': '查詢地址失敗'
            })
        address_list = []
        for address in all_address:
            dic = {}
            dic['id'] = address.id
            dic['address'] = address.address
            dic['receiver'] = address.receiver
            dic['receiver_mobile'] = address.receiver_mobile
            dic['tag'] = address.tag
            dic['postcode'] = address.postcode
            dic['is_default'] = address.is_default

            address_list.append(dic)

        return JsonResponse({
            'code': 200,
            'address_list': address_list
        })

    @logging_check
    def post(self, request, username):
        """
        接收用戶提交的數據
        校驗數據
        將數據保存到數據庫
            1.如果當前地址是用戶的第一個地址 設置為默認地址
            2.如果當前地址不是用戶的第一個地址 設置為非默認地址
                {
          'receiver':'小柏',
          'receiver_phone':'0985821309',
          'address':'高雄市鳳山區文衡路135巷4號',
          'postcode':'830',
          'tag':'公司'
        }
        """
        data = json.loads(request.body)
        receiver = data.get('receiver')
        receiver_phone = data.get('receiver_phone')
        address = data.get('address')
        postcode = data.get('postcode')
        tag = data.get('tag')
        print('data', data)
        user = request.myuser

        # 用filter查 不一定能查到所以不會報錯
        old_address = Address.objects.filter(user_profile=user)
        is_default = False
        if not old_address:
            is_default = True

        Address.objects.create(
            user_profile=user,
            receiver=receiver,
            address=address,
            receiver_mobile=receiver_phone,
            postcode=postcode,
            tag=tag,
            is_default=is_default
        )

        return JsonResponse({
            'code': 200,
            'data': "新增地址成功"
        })

    @logging_check
    def put(self, request, username, id):
        data = json.loads(request.body)
        receiver = data.get('receiver')
        receiver_phone = data.get('receiver_phone')
        address = data.get('address')
        postcode = data.get('postcode')
        tag = data.get('tag')
        user = request.myuser

        try:
            target_address = Address.objects.get(id=id)
        except Exception as e:
            print(e)
            return JsonResponse({
                'code': 400,
                'error': '查找地址資料失敗'
            })

        target_address.receiver = receiver
        target_address.receiver_phone = receiver_phone
        target_address.address = address
        target_address.tag = tag
        target_address.postcode = postcode
        target_address.save()

        return JsonResponse({
            "code": 200,
            "data": "修改成功"
        })

    @logging_check
    def delete(self, request, username, id):
        user = request.myuser
        target_address = Address.objects.get(id=id)
        target_address.delete()

        return JsonResponse({
            "code": 200,
            "data": "刪除成功"
        })


class AddressDefault(View):
    @logging_check
    def post(self, request, username):
        data = json.loads(request.body)
        addr_id = data.get('id')
        user = request.myuser

        with transaction.atomic():
            sid = transaction.savepoint()
            try:
                old_default = Address.objects.get(user_profile=user, is_default=True)
                old_default.is_default = False
                old_default.save()

                new_default = Address.objects.get(id=addr_id, is_active=True)
                new_default.is_default = True
                new_default.save()
            except Exception as e:
                transaction.rollback(sid)
                return JsonResponse({
                    'code': 10110,
                    'error': '查詢地址失敗'
                })
            transaction.savepoint_commit(sid)
            return JsonResponse({
                'code': 200,
                'data': '設置默認地址成功'
            })

# def send_verification_email(email, verification_code):
#     subject = '來自DaiLee的驗證信'
#     message = f'Your verification code is {verification_code}.'
#     from_email = 'a821309@gmail.com'
#     recipient_list = [email]
#     send_mail(subject, message, from_email, recipient_list)
