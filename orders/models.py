from django.db import models
from goods.models import SKU
from users.models import UserProfile

STATUS_CHOICES = (
    (1, "待付款"),
    (2, "待出貨"),
    (3, "待收貨"),
    (4, "訂單完成")
)


class OrderInfo(models.Model):
    user_profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    order_id = models.CharField(max_length=64, primary_key=True, verbose_name="訂單編號")
    # 訂單總金額、商品總數量
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="訂單總金額")
    total_count = models.IntegerField(verbose_name="商品總數")
    # 支付方式:綠界
    pay_method = models.SmallIntegerField(default=1, verbose_name="支付方式")
    # 運費
    freight = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="運費")
    # 訂單狀態
    status = models.SmallIntegerField(verbose_name="訂單狀態", choices=STATUS_CHOICES)

    # 剩餘地址地段
    receiver = models.CharField(verbose_name="收件人", max_length=10)
    address = models.CharField(verbose_name="收件地址", max_length=100)
    receiver_mobile = models.CharField(verbose_name="手機", max_length=11)
    tag = models.CharField(verbose_name="標籤", max_length=10)

    created_time = models.DateTimeField(auto_now_add=True)
    updated_time = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "orders_order_info"


class OrderGoods(models.Model):
    """
    訂單商品表
    訂單表:訂單商品表 ---> 1:n
    SKU表:訂單商品表 ---> 1:n
    """
    order_info = models.ForeignKey(OrderInfo, on_delete=models.CASCADE)
    sku = models.ForeignKey(SKU, on_delete=models.CASCADE)

    # 數量 單價
    count = models.IntegerField(default=1, verbose_name="數量")
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="單價")

    created_time = models.DateTimeField(auto_now_add=True)
    updated_time = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "orders_order_goods"