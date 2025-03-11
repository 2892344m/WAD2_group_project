from django.contrib import admin

from shop.models import UserAccount, Product, Wishlist, Category, Review, Basket

class CategoryAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug':('name',)}

class ProductAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug':('product_name',)}


admin.site.register(UserAccount)
admin.site.register(Product, ProductAdmin)
admin.site.register(Wishlist)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Review)
admin.site.register(Basket)