from django.urls import path
from . import views
from django.views.decorators.cache import cache_page
urlpatterns = [
    path('index', cache_page(60, cache='goods')(views.GoodsIndexView.as_view())),
    path('catalog/<int:catalog_id>/', views.GoodCatalogView.as_view()),
    path('detail/<int:sku_id>', views.GoodsDetailView.as_view()),
]