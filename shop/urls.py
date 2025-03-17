from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

from shop import views

app_name = 'shop'

urlpatterns = [
    path('', views.homepage, name='homepage'),
    path('view_product/<slug:product_name_slug>/', views.view_product, name='view_product'),
    path('add_product/', views.add_product, name='add_product'),
    path('search/', views.search, name='search'),
    path('view_category/<slug:category_name_slug>/', views.view_category, name='view_category'),
    path('wishlist/', views.wishlist_detail, name='wishlist_detail'),
    path('wishlist/add/<slug:product_slug>/', views.add_to_wishlist, name='add_to_wishlist'),
    path('wishlist/remove/<slug:product_slug>/', views.remove_from_wishlist, name='remove_from_wishlist'),
    path('basket/', views.basket_detail, name='basket_detail'),
    path('basket/add/<slug:product_slug>/', views.add_to_basket, name='add_to_basket'),
    path('basket/remove/<slug:product_slug>/', views.remove_from_basket, name='remove_from_basket'),
    path('checkout/', views.checkout_detail, name='checkout_detail'),
    path('purchase_confirm/', views.purchase_confirm, name='purchase_confirm'),
    path('edit_balance/', views.edit_balance, name='edit_balance'),
    path('add_rating/<slug:product_slug>/', views.add_rating, name='add_rating'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
