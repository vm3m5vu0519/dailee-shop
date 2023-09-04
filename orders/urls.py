from django.urls import path
from . import views

urlpatterns = [
    path('<username>/advance', views.CartsView.as_view()),
    path('<username>', views.OrderView.as_view())
]