from django.urls import path
from . import views

urlpatterns = [
    path('<username>/profile', views.UserProfileView.as_view()),
    path('register', views.RegisterView.as_view()),
    path('<username>/address', views.AddressView.as_view()),
    path('<username>/address/default', views.AddressDefault.as_view()),
    path('<username>/address/<id>', views.AddressView.as_view()),
]
