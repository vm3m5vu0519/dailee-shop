from django.db import models


# Create your models here.
class UserProfile(models.Model):
    """用戶表"""
    # 信箱 密碼 用戶名 性別  手機 出生年月日
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    username = models.CharField(max_length=30, unique=True)
    gender = models.CharField(max_length=50, default='女')
    phone = models.CharField(max_length=15)
    avatar = models.ImageField(null=True)

    def __str__(self):
        return self.email


class Address(models.Model):
    """
        用户表:地址表 ---> 1:n
    """
    user_profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    receiver = models.CharField(verbose_name="收件人", max_length=10)
    address = models.CharField(verbose_name="收件地址", max_length=100)
    postcode = models.CharField(verbose_name="郵遞區號", max_length=3)
    receiver_mobile = models.CharField(verbose_name="手機號碼", max_length=10)
    tag = models.CharField(verbose_name="標籤", max_length=10)
    is_default = models.BooleanField(verbose_name="默認地址", default=False)
    is_active = models.BooleanField(verbose_name="驗證用戶", default=True)
    created_time = models.DateTimeField(auto_now_add=True)
    updated_time = models.DateTimeField(auto_now=True)

    # 修改表名
    class Meta:
        db_table = "user_address"
