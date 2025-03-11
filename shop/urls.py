from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

from shop import views

app_name = 'shop'

urlpatterns = [
    path('', views.homepage, name='homepage'),
    path('view_product/<slug:product_name_slug>/', views.view_product, name='view_product'),
    path('add_product/', views.add_product, name='add_product'),
]  + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)