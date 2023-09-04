from django.shortcuts import render
from django.core.paginator import Paginator
from django.conf import settings
from django.http import JsonResponse
from django.views import View
from utils.cache_dec import cache_check
from .models import *


# Create your views here.
class GoodsIndexView(View):
    def get(self, request):
        all_catalog = Catalog.objects.all()
        data = []
        for cata in all_catalog:
            cata_dic = {}
            cata_dic['catalog_id'] = cata.id
            cata_dic['catalog_name'] = cata.name
            spu_ids = SPU.objects.filter(catalog=cata).values("id")
            sku_list = SKU.objects.filter(spu__in=spu_ids, is_launched=True)[0:3]
            cata_dic['sku'] = []
            for sku in sku_list:
                sku_dict = {}
                sku_dict['skuid'] = sku.id
                sku_dict['name'] = sku.name
                sku_dict['caption'] = sku.caption
                sku_dict['price'] = str(sku.price)
                sku_dict['image'] = str(sku.default_image_url)
                cata_dic['sku'].append(sku_dict)
            data.append(cata_dic)

        return JsonResponse({
            "code": 200,
            "data": data,
            "base_url": settings.PIC_URL,
        })


class GoodCatalogView(View):
    def get(self, request, catalog_id):
        # 當使用flat=True with時values_list，它將返回指定字段的值列表而不是元組。例如，如果使用values_list('id', flat=True)，它將返回一個值列表，例如[1, 2, 3]
        spu_ids = SPU.objects.filter(catalog_id=catalog_id).values_list('id', flat=True)
        sku_list = SKU.objects.filter(spu_id__in=spu_ids, is_launched=True)

        paginator = Paginator(sku_list, 9)  # Set page size to 9
        page = request.GET.get('page')
        skus = paginator.get_page(page)

        data = []
        for sku in skus:
            sku_dict = {}
            sku_dict['skuid'] = sku.id
            sku_dict['name'] = sku.name
            sku_dict['price'] = str(sku.price)
            sku_dict['image'] = str(sku.default_image_url)
            data.append(sku_dict)

        paginator_info = {
            'pagesize': 9,
            'total': sku_list.count(),
        }

        return JsonResponse({
            'code': 200,
            'data': data,
            'paginator': paginator_info,
            'base_url': settings.PIC_URL,
        })

class GoodsDetailView(View):
    @cache_check(key_pre='gd', key_param='sku_id', cache='goods_detail', expire=60)
    def get(self, request, sku_id):
        try:
            sku_item = SKU.objects.get(id=sku_id)
        except Exception as e:
            return JsonResponse({
                "code": 400,
                "error": "查找sku數據失敗"
            })

        data = {}

        # catalog SKU -->SPU -->Catalog
        # id name
        sku_catalog = sku_item.spu.catalog
        data['catalog_id'] = sku_catalog.id
        data['catalog_name'] = sku_catalog.name

        # SKU
        # name caption price default_image_url spu
        data['name'] = sku_item.name
        data['caption'] = sku_item.caption
        data['price'] = sku_item.price
        data['image'] = str(sku_item.default_image_url)
        data['spu'] = str(sku_item.spu.id)

        data['detail_image'] = ""

        # 銷售屬性  SKU --> SPU_SALE_ATTR --> SPU_SALE_ATTR_VALUE
        # 銷售屬性名 銷售屬性
        sku_sale_attr_id = []
        sku_sale_attr_name = []

        sale_attr_value_query = sku_item.sale_attr_value.all()
        for sale_attr_value in sale_attr_value_query:
            sku_sale_attr_id.append(sale_attr_value.spu_sale_attr.id)
            sku_sale_attr_name.append(sale_attr_value.spu_sale_attr.name)

        # 銷售屬性值的id和name
        sku_sale_attr_value_id = [i.id for i in sale_attr_value_query]
        sku_sale_attr_value_name = [i.name for i in sale_attr_value_query]

        # 將數據保存到data中
        data["sku_sale_attr_id"] = sku_sale_attr_id
        data["sku_sale_attr_name"] = sku_sale_attr_name
        data["sku_sale_attr_val_id"] = sku_sale_attr_value_id
        data["sku_sale_attr_val_names"] = sku_sale_attr_value_name

        # 保存銷售屬性和銷售屬性值的對應關係
        sku_all_sale_attr_vals_id = {}
        sku_all_sale_attr_vals_name = {}

        for id in sku_sale_attr_id:
            item_query = SaleAttrValue.objects.filter(spu_sale_attr_id=id)
            sku_all_sale_attr_vals_id[id] = []
            sku_all_sale_attr_vals_name[id] = []
            for item in item_query:
                sku_all_sale_attr_vals_id[id].append(item.id)
                sku_all_sale_attr_vals_name[id].append(item.name)

        data['sku_all_sale_attr_vals_id'] = sku_all_sale_attr_vals_id
        data['sku_all_sale_attr_vals_name'] = sku_all_sale_attr_vals_name

        # 規格屬性
        # 規格屬性名 規格屬性值
        spec = {}
        spec_query = SKUSpecValue.objects.filter(sku=sku_item)
        for item in spec_query:
            key = item.spu_spc.name
            value = item.name
            spec[key] = value

        data["spec"] = spec

        return JsonResponse({
            "code": 200,
            "data": data,
            "base_url": settings.PIC_URL
        })
