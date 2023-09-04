from django.db import models

# Create your models here.
class Catalog(models.Model):
    """
    商品分類
    """
    name = models.CharField(max_length=10, verbose_name='商品類別')
    created_time = models.DateTimeField(auto_now_add=True)
    updated_time = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "goods_catalog"
        verbose_name = '商品類別'
        verbose_name_plural = verbose_name

class SPU(models.Model):
    name = models.CharField(max_length=50, verbose_name='名稱')
    sales = models.IntegerField(default=0, verbose_name='商品銷量')
    comments = models.IntegerField(default=0, verbose_name='評價數量')
    catalog = models.ForeignKey(Catalog, verbose_name='商品類別', on_delete=models.CASCADE)
    created_time = models.DateTimeField(auto_now_add=True)
    updated_time = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "goods_spu"
        verbose_name = 'SPU'
        verbose_name_plural = verbose_name


class SPUSaleAttr(models.Model):
    """
    SPU銷售屬性 顏色規格
    """
    spu = models.ForeignKey(SPU, on_delete=models.CASCADE)
    name = models.CharField(max_length=20, verbose_name='SPU屬性名稱')
    created_time = models.DateTimeField(auto_now_add=True)
    updated_time = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'goods_spu_sale_attr'
        verbose_name = 'SPU銷售屬性'
        verbose_name_plural = verbose_name


class SaleAttrValue(models.Model):
    """
    銷售屬性值表 星光灰 星空藍
    """
    spu_sale_attr = models.ForeignKey(SPUSaleAttr, on_delete=models.CASCADE, verbose_name='銷售屬性')
    name = models.CharField(max_length=20, verbose_name='銷售屬性值')
    created_time = models.DateTimeField(auto_now_add=True)
    updated_time = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'goods_sale_attr_value'
        verbose_name = '銷售屬性值'
        verbose_name_plural = verbose_name


class SKU(models.Model):
    """
    SKU
    """
    name = models.CharField(max_length=50, verbose_name='SKU名稱')
    caption = models.CharField(max_length=100, verbose_name='副標題')
    spu = models.ForeignKey(SPU, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='單價')
    cost_price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='成本價')
    market_price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='市場價')
    stock = models.IntegerField(default=0, verbose_name='庫存')
    sales = models.IntegerField(default=0, verbose_name='銷量')
    comments = models.IntegerField(default=0, verbose_name='評價數')
    is_launched = models.BooleanField(default=True, verbose_name='是否上架銷售')
    default_image_url = models.ImageField(verbose_name='默認圖片', default=None, upload_to='sku')
    version = models.IntegerField(default=0, verbose_name="庫存版本")
    sale_attr_value = models.ManyToManyField(SaleAttrValue)
    created_time = models.DateTimeField(auto_now_add=True)
    updated_time = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "goods_sku"
        verbose_name = 'SKU表'
        verbose_name_plural = verbose_name


class SKUImage(models.Model):
    """
        SKU圖片
    """
    sku = models.ForeignKey(SKU, on_delete=models.CASCADE, verbose_name='sku')
    image = models.ImageField(verbose_name='圖片路徑', upload_to='sku_images')
    created_time = models.DateTimeField(auto_now_add=True)
    updated_time = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'goods_sku_image'
        verbose_name = 'SKU圖片'
        verbose_name_plural = verbose_name


class SPUSpec(models.Model):
    """
    SPU規格表 商品名稱
    """
    spu = models.ForeignKey(SPU, on_delete=models.CASCADE)
    name = models.CharField(max_length=20, verbose_name='SPU規格名稱')
    created_time = models.DateTimeField(auto_now_add=True)
    updated_time = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'goods_spu_spec'
        verbose_name = 'SPU規格'
        verbose_name_plural = verbose_name


class SKUSpecValue(models.Model):
    """
    SKU規格屬性表 商品完整規格名稱 星空灰 ipad air 64G
    """
    sku = models.ForeignKey(SKU, on_delete=models.CASCADE)
    spu_spec = models.ForeignKey(SPUSpec, on_delete=models.CASCADE)
    name = models.CharField(max_length=20, verbose_name='SKU規格名稱值')
    created_time = models.DateTimeField(auto_now_add=True)
    updated_time = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'goods_spu_spec_value'
        verbose_name = 'SKU規格屬性表'
        verbose_name_plural = verbose_name
