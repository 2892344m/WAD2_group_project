from django.db import models
from django.contrib.auth.models import User
from django.template.defaultfilters import slugify
from django.core.validators import MaxValueValidator, MinValueValidator

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
    price = models.FloatField(default=0.01,validators=[MinValueValidator(0.01)])
    quantity = models.IntegerField(default=1, validators=[MinValueValidator(1)])
    average_rating = models.FloatField(default=0, validators=[MinValueValidator(0), MaxValueValidator(5)])
    image_reference = models.ImageField(upload_to="product_img/", default='product_img/placeholder.jpg')
    views = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    date_added = models.DateField(default=date.today)
    description = models.CharField(max_length=DESCRIPTION_MAX_LENGTH)
    slug = models.SlugField(unique=True)

    def save(self, *args, **kwargs):
        self.slug = slugify(self.product_name)
        if self.views < 0: self.views = 0
        if self.price < 0.01: self.price = 0.01
        if self.quantity < 1: self.quantity = 1
        if self.average_rating < 0: self.average_rating = 0
        elif self.average_rating > 5: self.average_rating = 5
        super(Product, self).save(*args, **kwargs)

    def __str__(self):
        return self.product_name

#Database for basket
class Basket(models.Model):
    basket_owner = models.ForeignKey(User, on_delete=models.CASCADE)
    products = models.ManyToManyField(Product, blank=True)
    total_price = models.FloatField(default=0, validators=[MinValueValidator(0)])

    def save(self, *args, **kwargs):
        if self.total_price < 0: self.total_price = 0
        super(Basket, self).save(*args, **kwargs)

    def __str__(self):
        return f"{self.basket_owner.username}'s basket"

#Database for orders
class Order(models.Model):
    order_owner = models.ForeignKey(User, on_delete=models.CASCADE)
    products_to_deliver = models.ManyToManyField(Product, blank=True)
    time_to_deliver = models.DateTimeField(default=date.today)

    def __str__(self):
        return f"{self.order_owner.username}'s order"

#Database for user account
class UserAccount(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    seller_account = models.BooleanField()
    account_img = models.ImageField(upload_to='profile_img/', default='profile_img/default.jpg')
    balance = models.FloatField(default=0, validators=[MinValueValidator(0)])
    orders = models.ManyToManyField(Order, blank=True)

    def save(self, *args, **kwargs):
        if self.balance < 0: self.balance = 0
        super(UserAccount, self).save(*args, **kwargs)

    def __str__(self):
        return self.user.username

#Database for reviews
class Review(models.Model):
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    rating = models.IntegerField(validators=[MaxValueValidator(5), MinValueValidator(0)])
    comment = models.CharField(max_length=DESCRIPTION_MAX_LENGTH)

    def save(self, *args, **kwargs):
        if self.rating < 0: self.rating = 0
        elif self.rating > 5: self.rating = 5
        super(Review, self).save(*args,**kwargs)

    def __str__(self):
        return str(self.rating)

#Database for wishlist
class Wishlist(models.Model):
    wishlist_owner = models.ForeignKey(User, on_delete=models.CASCADE)
    products = models.ManyToManyField(Product, blank=True)

    def __str__(self):
        return f"{self.wishlist_owner.username}'s wishlist"



    
