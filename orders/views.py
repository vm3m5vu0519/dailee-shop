from django.utils import timezone
from cart.views import CartsView
from users.models import *
from utils.logging_dec import logging_check
from django.views import View
from django.http import JsonResponse
from django.db import transaction
from django.conf import settings
from goods.models import SKU
from orders.models import OrderInfo, OrderGoods

STATUS_CHOICES = (
    (1, "待付款"),
    (2, "待出貨"),
    (3, "待收貨"),
    (4, "訂單完成")
)


# Create your views here.
class AdvanceView(View):
    """
        使用戶能夠向其帳戶添加新訂單。 它根據 GET 請求中的結算參數獲取用戶的地址和購物車項目列表。
    """

    def get_address_list(self, user_id):
        """
        根據用戶id獲取這個用戶的所有地址  返回一個指定格式的列表
        區分是否為默認地址 默認地址放在列表的第一個元素
        """
        all_address = Address.objects.filter(user_profile_id=user_id, is_active=True)
        default_address = []
        no_default_address = []

        for addr in all_address:
            addr_dict = {}
            addr_dict['id'] = addr.id
            addr_dict['name'] = addr.name
            addr_dict['mobile'] = addr.mobile
            addr_dict['title'] = addr.title
            addr_dict['address'] = addr.address

            if addr.is_default:
                default_address.append(addr_dict)
            else:
                no_default_address.append(addr_dict)

        return default_address + no_default_address

    def get_order_sku_list(self, user_id):
        carts_obj = CartsView()
        sku_list = carts_obj.get_skus_list(user_id)
        sku_list = [sku for sku in sku_list if sku['selected'] == 1]
        return sku_list

    @logging_check
    def get(self, request, username):
        user = request.myuser
        address_list = self.get_address_list(user.id)
        # 獲取要添加到訂單的商品信息
        settlement_type = request.Get.get('settlement')
        if settlement_type == '0':
            # 購物車添加
            sku_list = self.get_order_sku_list(user.id)
        # 立即購買
        else:
            sku_list = []

        return JsonResponse({
            "code": 200,
            "data": {
                "address": address_list,
                "sku_list": sku_list
            },
            "base_url": settings.PIC_URL
        })


class OrderView(View):
    @logging_check
    def get(self, request, order_status, username):
        orders = OrderInfo.objects.filter(status=order_status)
        order_list = []
        for order in orders:
            order_goods = OrderGoods.objects.filter(order_info=order)
            order_sku = []
            for item in order_goods:
                sku = item.sku
                value_query = sku.sale_attr_value.all()
                sku_name = sku.name
                sku_sale_attr_names = [i.spu_sale_attr.name for i in value_query]
                sku_sale_attr_vals = [i.name for i in value_query]
                sku_dict = {
                    'id': sku.id,
                    'default_img_url': sku.default_image_url,
                    'name': sku_name,
                    'price': str(sku.price),
                    'count': item.count,
                    'total_amount': item.total_amount,
                    'sku_sale_attr_names': sku_sale_attr_names,
                    'sku_sale_attr_vals_': sku_sale_attr_vals,
                }
                order_sku.append(sku_dict)

            address = {
                'address': order.address,
                'mobile': order.receiver_mobile,
                'receiver': order.receiver,
            }

            order_dict = {
                'order_id': order.order_id,
                'order_total_count': order.total_count,
                'order_total_amount': order.total_amount,
                'order_freight': order.freight,
                'address': address,
                'status': order.status,
                'order_sku': order_sku,
                'order_time': order.created_time.strftime('%Y-%m-%d %H:%M:%S'),
            }

            order_list.append(order_dict)

        data = {
            'orders_list': order_list,
            'status': status_type,
        }

        return JsonResponse({
            'code': 200,
            'data': data
        })

    @transaction.atomic
    @logging_check
    def post(self, request):
        user = request.myuser
        sku_ids = request.POST.getlist('sku_ids')
        address_id = request.POST.get('address_id')

        address = Address.objects.filter(pk=address_id).first()
        if not address:
            return JsonResponse({
                'code': 400,
                'errmsg': '無效的地址'
            })

        total_count = 0
        total_amount = 0
        with transaction.atomic():
            sid = transaction.savepoint()
            order_id = timezone.now().strftime('%Y%m%d%H%M%S') + str(user.id)
            order = OrderInfo.objects.create(
                order_id=order_id,
                user_profile=user,
                receiver=address.receiver,
                address=address,
                receiver_mobile=address.receiver_mobile,
                tag=address.tag,
                total_count=0,
                total_amount=0,
                freight=0,
                pay_method=1,
                status=1
            )

            for sku_id in sku_ids:
                try:
                    sku = SKU.objects.select_for_update().get(pk=sku_id)
                except Exception as e:
                    # if sku does not exist
                    transaction.savepoint_rollback(sid)
                    return JsonResponse({
                        'code': 400,
                        'error': '商品不存在'
                    })

                count = request.POST.get('count')
                price = sku.price

                OrderGoods.objects.create(
                    order_info=order,
                    sku_id=sku_id,
                    count=count,
                    price=price
                )

                if sku.stock < count:
                    # if stock is not enough
                    transaction.savepoint_rollback(sid)
                    return JsonResponse({
                        'code': 400,
                        'error': '庫存不足'
                    })

                origin_stock = sku.stock
                new_stock = origin_stock - count
                new_sales = sku.sales + count
                result = SKU.objects.filter(pk=sku_id, stock=origin_stock).update(stock=new_stock, sales=new_sales)
                if result == 0:
                    # if the sku's stock has been updated by other requests
                    transaction.savepoint_rollback(sid)
                    return JsonResponse({
                        'code': 400,
                        'error': '下單失敗，請稍後再試'
                    })

                total_count += int(count)
                total_amount += int(count) * float(price)

            # calculate the total amount of the order
            total_amount += float(order.freight)

            # update the total count and amount of the order
            order.total_count = total_count
            order.total_amount = total_amount
            order.save()

            transaction.savepoint_commit(sid)

        pay_url = 'http://alipay.com/xxx/xx/'

        # return the order information
        data = {
            'seller': 'Dailee',
            'total_amount': total_amount,
            'order_id': order_id,
            'pay_url': pay_url
        }

        return JsonResponse({
            'code': 200,
            'data': data
        })

    @logging_check
    def put(self, request):
        order_id = request.GET.get('order_id')

        try:
            order = OrderInfo.objects.get(order_id=order_id)

        except OrderInfo.DoesNotExist:
            return JsonResponse({
                'code': 400,
                'error': '訂單不存在'
            })

        if order.status != 3:
            return JsonResponse({
                'code': 400,
                'error': '訂單未完成'
            })

        order.status = 4
        order.save()

        return JsonResponse({'code': 200})
