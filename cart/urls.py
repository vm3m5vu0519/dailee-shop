from django.urls import path
from . import views

urlpatterns = [
    path('<username>', views.CartsView.as_view())
]
0