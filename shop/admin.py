from django.contrib import admin

from shop.models import UserAccount, Product, Wishlist, Category, Review, Basket

admin.site.register(UserAccount)
admin.site.register(Product)
admin.site.register(Wishlist)
admin.site.register(Category)
admin.site.register(Review)
admin.site.register(Basket)