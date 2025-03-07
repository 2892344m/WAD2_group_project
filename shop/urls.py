from django.urls import path

from shop import views

app_name = 'shop'

urlpatterns = [
    path('', views.homepage, name='homepage'),
    path('show_product', views.show_product, name='show_product'),
    path('add_product', views.add_product, name='add_product'),
]