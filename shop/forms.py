from django import forms
from shop.models import Product, Review, UserAccount
from django.contrib.auth.models import User

STRING_MAX_LENGTH = 128

class ProductForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = ('product_name','price','image_reference','description','category',)

class ReviewForm(forms.ModelForm):
    class Meta:
        model = Review
        fields = ('rating', 'comment',)

class SearchForm(forms.Form):
    search = forms.CharField(max_length=STRING_MAX_LENGTH,
                             widget=forms.TextInput(attrs={'placeholder': 'Enter search here'}),
                             label="")

class BalanceForm(forms.ModelForm):
    class Meta:
        model = UserAccount
        fields = ("balance",) 

#Forms for changing different parts of the User Account
class ChangeUserFullnameForm(forms.Form):
    first_name = forms.CharField(max_length=STRING_MAX_LENGTH)
    last_name = forms.CharField(max_length=STRING_MAX_LENGTH)

class ChangeUsernameForm(forms.Form):
    username = forms.CharField(max_length=STRING_MAX_LENGTH)

class BecomeASellerForm(forms.Form):
    seller = forms.BooleanField()

class ChangeProfileImgForm(forms.Form):
    img = forms.ImageField()

class ChangeBalanceForm(forms.Form):
    balance = forms.FloatField()