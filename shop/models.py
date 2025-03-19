from django.db import models
from django.contrib.auth.models import User
from django.template.defaultfilters import slugify
from datetime import date


STRING_MAX_LENGTH = 128
DESCRIPTION_MAX_LENGTH = 250

#Database for different product categories
class Category(models.Model):
    name = models.CharField(max_length=STRING_MAX_LENGTH, unique=True)
    slug = models.SlugField(unique=True)

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super(Category, self).save(*args, **kwargs)

    class Meta:
        verbose_name_plural = 'categories'

    def __str__(self):
        return self.name
    
#Database for product information
class Product(models.Model):
    product_ID = models.BigAutoField(primary_key=True)
    seller = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    product_name = models.CharField(max_length=STRING_MAX_LENGTH)
    price = models.FloatField(default=0)
    quantity = models.IntegerField(default=0)
    average_rating = models.IntegerField(default=-1)
    image_reference = models.ImageField(upload_to="product_img/")
    views = models.IntegerField(default=0)
    date_added = models.DateField(default=date.today)
    description = models.CharField(max_length=DESCRIPTION_MAX_LENGTH)
    slug = models.SlugField(unique=True)

    def save(self, *args, **kwargs):
        self.slug = slugify(self.product_name)
        super(Product, self).save(*args, **kwargs)

    def __str__(self):
        return self.product_name

#Database for basket
class Basket(models.Model):
    basket_owner = models.ForeignKey(User, on_delete=models.CASCADE)
    products = models.ManyToManyField(Product, blank=True)
    total_price = models.FloatField(default=0)

    def __str__(self):
        return f"{self.basket_owner.username}'s basket"

#Database for orders
class Order(models.Model):
    order_owner = models.ForeignKey(User, on_delete=models.CASCADE)
    products_to_deliver = models.ManyToManyField(Product, blank=True)
    time_to_deliver = models.DateTimeField()

    def __str__(self):
        return f"{self.order_owner.username}'s order"

#Database for user account
class UserAccount(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    seller_account = models.BooleanField()
    account_img = models.ImageField(upload_to='profile_img/')
    balance = models.FloatField(default=0)
    orders = models.ManyToManyField(Order, blank=True)

    def __str__(self):
        return self.user.username

#Database for reviews
class Review(models.Model):
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    rating = models.IntegerField()
    comment = models.CharField(max_length=DESCRIPTION_MAX_LENGTH)

    def __str__(self):
        return str(self.rating)

#Database for wishlist
class Wishlist(models.Model):
    wishlist_owner = models.ForeignKey(User, on_delete=models.CASCADE)
    products = models.ManyToManyField(Product, blank=True)

    def __str__(self):
        return f"{self.wishlist_owner.username}'s wishlist"



    
