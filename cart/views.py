import json
from django.conf import settings
from django.http import JsonResponse
from django.views import View
from goods.models import SKU
from utils.logging_dec import logging_check
from django.core.cache import caches

# Create your views here.
CARTS_CACHE = caches['carts']


class CartsView(View):
    def get_cache_key(self, user_id):
        """
            get_cache_key 方法根據用戶的 ID 生成一個密鑰，以將他們的購物車數據存儲在緩存中。
        """
        key = f"carts_{user_id}"
        return key

    def get_carts_all_data(self, cache_key):
        """
            get_carts_all_data 方法從緩存中獲取給定用戶的所有購物車數據。 如果該用戶沒有購物車數據，它會返回一個空字典。
        """
        data = CARTS_CACHE.get(cache_key)
        print(data)
        if not data:
            return {}
        return data

    def get_skus_list(self, user_id):
        """
            get_skus_list 方法獲取給定用戶的 SKU 列表。 它遍歷用戶購物車數據中的所有項目，檢索每個項目的 SKU，並將 SKU 信息添加到列表中。 然後返回此列表。
        """
        cache_key = self.get_cache_key(user_id)
        carts_dict = self.get_carts_all_data(cache_key)
        skus_list = []
        # carts_userid:{
        #      "sku_id":[count,selected],
        # }
        print(carts_dict)
        for sku_id in carts_dict:
            sku = SKU.objects.get(id=sku_id)
            value_query = sku.sale_attr_value.all()
            print('value_query', value_query)
            for i in value_query:
                print(i.name)
            sku_dict = {
                "id": sku.id,
                "name": sku.name,
                # "count": int(carts_dict[sku.id]['count']),
                # "selected": int(carts_dict[sku.id]['selected']),
                "count": int(carts_dict[str(sku.id)][0]),
                "selected": int(carts_dict[str(sku.id)][1]),
                "default_image_url": str(sku.default_image_url),
                "price": sku.price,
                "sku_sale_attr_name": [i.spu_sale_attr.name for i in value_query],
                "sku_sale_attr_val": [i.name for i in value_query]
            }
            skus_list.append(sku_dict)
        print(skus_list)
        return skus_list

    @logging_check
    def post(self, request, username):
        """
            post 方法負責將商品添加到購物車。 需要一個包含要添加的項目的 sku_id 和計數的 JSON 對象。
            從數據庫中檢索 SKU，並根據 SKU 的庫存檢查項目計數。 如果計數大於庫存，則返回錯誤響應。
            否則，該項目將添加到緩存中的購物車數據，並返回成功響應。
        """

        data = json.loads(request.body)
        sku_id = data.get('sku_id')
        count = int(data.get('count'))

        try:
            sku = SKU.objects.get(id=sku_id, is_launched=True)
        except Exception as e:
            return JsonResponse({
                "code": 400,
                "error": "SKU失效"
            })

        # 收集數據
        user_id = request.myuser.id
        cache_key = self.get_cache_key(user_id)
        carts_data = self.get_carts_all_data(cache_key)

        if sku_id not in carts_data:
            item = [count, 1]
            carts_data[sku_id] = item
        else:
            old_count = int(carts_data[sku_id][0])
            new_count = old_count + count
            if int(new_count) > sku.stock:
                return JsonResponse({
                    "code": 400,
                    "error": "庫存不足"
                })
            carts_data[sku_id][0] = new_count

        cache_expiry = 60 * 60  # 1 hour in seconds
        CARTS_CACHE.set(cache_key, carts_data, cache_expiry, version=None)
        print(cache_key, carts_data)
        return JsonResponse({
            "code": 200,
            "data": {
                "carts_count": len(carts_data)
            },
            "base_url": settings.PIC_URL
        })

    @logging_check
    def get(self, request, username):
        """
            get 方法處理檢索用戶的購物車數據。 它調用 get_skus_list 方法來獲取 SKU 列表並在響應中返回此列表。
        """
        user = request.myuser
        skus_list = self.get_skus_list(user.id)
        print('skus_list:', skus_list)

        return JsonResponse({
            'code': 200,
            'data': skus_list,
            'base_url': settings.PIC_URL
        })

    @logging_check
    def delete(self, request, username):
        """
            delete 方法處理從購物車中刪除項目。 它期望包含要刪除的項目的 sku_id 的 JSON 對象。
            該項目從緩存中的購物車數據中刪除，並返回成功響應。
        """
        user = request.myuser
        data = json.loads(request.body)
        sku_id = data.get("sku_id")

        # carts_dict:{"1":[8,1],"2":[6,0]}
        carts_dict = self.get_carts_all_data(user.id)
        del (carts_dict[str(sku_id)])

        key = f"carts_{user.id}"
        CARTS_CACHE.set(key, carts_dict)

        return JsonResponse({
            "code": 200,
            "data": {'carts_count': len(carts_dict)},
            'base_url': settings.PIC_URL
        })

    @logging_check
    def put(self, request, username):
        """
            put 方法處理更新購物車。 它需要一個包含 sku_id 和更新狀態的 JSON 對象。
            狀態可以是“add”、“del”、“unselect”、“select”、“selectall”或“unselectall”。
            根據狀態，緩存中的購物車數據會相應更新，並返回成功響應。
        """
        data = json.loads(request.body)
        sku_id = data.get('sku_id')
        state = data.get('state')
        user = request.myuser
        carts_dict = self.get_carts_all_data(user.id)

        if state == "add":
            # 商品+1
            carts_dict[str(sku_id)][0] += 1
        elif state == "del":
            # 商品-1
            carts_dict[str(sku_id)][0] -= 1
        elif state == "unselect":
            # 取消單選
            carts_dict[str(sku_id)][1] = 0
        elif state == "select":
            # 單選
            carts_dict[str(sku_id)][1] = 1
        elif state == "selectall":
            # 全選
            for i in carts_dict:
                carts_dict[i][1] = 1
        elif state == "unselectall":
            # 取消全選
            for i in carts_dict:
                carts_dict[i][1] = 0
        key = f"carts_{user.id}"
        CARTS_CACHE.set(key, carts_dict)
        skus_list = self.get_skus_list(user.id)
        return JsonResponse({
            'code': 200,
            'data': skus_list,
            'base_url': settings.PIC_URL
        })
