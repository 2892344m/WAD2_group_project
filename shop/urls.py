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
    path('add_rating/<slug:product_slug>/', views.add_rating, name='add_rating'),
    path('account/', views.view_account, name='view_account'),
    path('change_name/', views.user_change_full_name, name="change_name"),
    path('change_username/', views.user_change_username, name="change_username"),
    path('become_seller/', views.become_a_seller, name="become_seller"),
    path('change_profile_img/', views.change_profile_img, name="change_profile_img"),
    path('change_balance/', views.change_balance, name='change_balance'),
    path('add_views/', views.add_views, name='add_views'),
    path('view_orders/', views.view_orders, name='view_orders'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
