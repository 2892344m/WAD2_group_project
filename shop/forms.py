from django import forms
from shop.models import Product, Review, UserAccount
from django.contrib.auth.models import User


class ProductForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = ('product_name','price','image_reference','description','category',)

class ReviewForm(forms.ModelForm):
    class Meta:
        model = Review
        fields = ('rating', 'comment',)

class SearchForm(forms.Form):
    search = forms.CharField(max_length=128, initial="Search for products here.")

class BalanceForm(forms.ModelForm):
    class Meta:
        model = UserAccount
        fields = ("balance",) 