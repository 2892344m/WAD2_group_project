from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_protect
from django.contrib.auth.decorators import login_required
from django.views import View

from shop.models import Wishlist, Basket, UserAccount, Product, Category, User, Order, Review
from shop.forms import ProductForm, SearchForm, BalanceForm, ReviewForm, ChangeUserFullnameForm, ChangeUsernameForm, BecomeASellerForm, ChangeProfileImgForm, ChangeBalanceForm

from datetime import date
from datetime import timedelta, date
import random
import statistics

import json

# Collects the Top 5 most viewed and most recently added pages, then sends them to the homepage to display
# Also sends a list of all categories
def homepage(request):
    context_dict = {}
    context_dict['most_viewed_products'] = Product.objects.order_by('-views')[:4]
    context_dict['recently_added_products'] = Product.objects.order_by('-date_added')[:4]
    context_dict['category_list'] = Category.objects.order_by()

    if request.user.is_authenticated:
        userAccount, created = UserAccount.objects.get_or_create(user=request.user)
        context_dict['user_balance'] = userAccount.balance

    return render(request, 'shop/homepage.html', context=context_dict)

# This collects information on a requested product to be displayed for the user
# The URL is in the form: http://127.0.0.1:8000/shop/view_product/<product_name_slug>/
def view_product(request, product_name_slug):
    context_dict = {}

    try:
        product = Product.objects.get(slug=product_name_slug)
        context_dict['product'] = product
        context_dict['reviews'] = Review.objects.filter(product=product)
    except Product.DoesNotExist:
        product = None  

    if product is None:
        return redirect('/shop/')

    return render(request, 'shop/view_product.html', context=context_dict)

# Displays all products present within a category
def view_category(request, category_name_slug):
    context_dict = {}

    try:
        category = Category.objects.get(slug=category_name_slug)
        products = Product.objects.filter(category=category)
        context_dict['products'] = products
        context_dict['message'] = category.name
    except Category.DoesNotExist:
        context_dict['products'] = None
        context_dict['message'] = "Unknown Category"

    return render(request, 'shop/search.html', context=context_dict)

# Displays products based on search input
def search(request):
    context_dict = {}

    if request.method == 'POST':
        form = SearchForm(request.POST)
        if form.is_valid():
            # Takes in a search query from the user
            # Compares the set of characters in the search with the set of characters of the product, 
            # if less then appends to the filtered product list
            # Finally, return the new product list to be displayed on the page
            search_query = form.cleaned_data['search']
            products = Product.objects.order_by()
            filtered_products = []
            for product in products:
                if set(search_query.lower()) <= set(product.product_name.lower()):
                    filtered_products.append(product)

            context_dict['form'] = form
            context_dict['products'] = filtered_products
            context_dict['message'] = "Search"

            return render(request, 'shop/search.html', context=context_dict)
    else:
        form = SearchForm()

    context_dict['form'] = form
    context_dict['products'] = Product.objects.order_by()

    return render(request, 'shop/search.html', context=context_dict)

# This allows a seller to add a product to the shop
@login_required
def add_product(request):
    context_dict = {}

    if request.method == 'POST':
        form = ProductForm(request.POST, request.FILES)
        if form.is_valid():
            product = form.save(commit=False)
            product.quantity = product.quantity + 1
            product.seller = request.user
            product.save()
            return redirect('/shop/')  # Redirect after saving
    else:
        form = ProductForm()

    context_dict['form'] = form
    context_dict['user'] = UserAccount.objects.get(user=request.user)
    
    return render(request, 'shop/add_product.html', context=context_dict)

#Wishlist methods, allowing a user to view, add, and remove from their wishlist
@login_required
def wishlist_detail(request):
    context_dict = {}

    wishlist = Wishlist.objects.get_or_create(wishlist_owner=request.user)[0]

    context_dict['products'] = wishlist.products.all()
    context_dict['type'] = "Wishlist"

    return render(request, 'shop/basket.html', context=context_dict)

@login_required
def add_to_wishlist(request, product_slug):
    product = get_object_or_404(Product, slug=product_slug)
    wishlist, created = Wishlist.objects.get_or_create(wishlist_owner=request.user)
    wishlist.products.add(product)
    return redirect('shop:wishlist_detail')

@login_required
def remove_from_wishlist(request, product_slug):
    product = get_object_or_404(Product, slug=product_slug)
    wishlist, created = Wishlist.objects.get_or_create(wishlist_owner=request.user)
    wishlist.products.remove(product)
    return redirect('shop:wishlist_detail')

#Same logic as wishlist, but with additional functionality for purchasing items
@login_required
def basket_detail(request):

    context_dict = {}

    basket = Basket.objects.get_or_create(basket_owner=request.user)[0]
    basket.save()

    context_dict['basket'] = basket
    context_dict['products'] = basket.products.all()
    context_dict['type'] = "Basket"

    return render(request, 'shop/basket.html', context=context_dict)

@login_required
def add_to_basket(request, product_slug):
    product = get_object_or_404(Product, slug=product_slug)
    basket, created = Basket.objects.get_or_create(basket_owner=request.user)
    basket.products.add(product)
    basket.total_price += product.price
    basket.save()

    return redirect('shop:basket_detail')

@login_required
def remove_from_basket(request, product_slug):
    product = get_object_or_404(Product, slug=product_slug)
    basket, created = Basket.objects.get_or_create(basket_owner=request.user)
    basket.products.remove(product)
    basket.total_price -= product.price
    basket.save()
    
    return redirect('shop:basket_detail')

#Confirm that user wants to purchase basket
@login_required
def checkout_detail(request):
    basket, created = Basket.objects.get_or_create(basket_owner=request.user)

    try:
        userAccount = UserAccount.objects.get(user=request.user)
    except UserAccount.DoesNotExist:
        userAccount = None

    total = 0
    for productInBasket in basket.products.all():
        total += productInBasket.price

    basket.total_price = total
    basket.save()

    valid = userAccount.balance >= total if userAccount else False

    return render(request, 'shop/checkout.html', {'basket': basket, 'products': basket.products.all(), 'valid': valid})

#Converts basket into an order, and assign it to the orders of the user
@login_required
def purchase_confirm(request):
    context_dict = {}
    user = request.user

    #Load user and their basket
    try:
        userAccount = UserAccount.objects.get(user=user)
        basket = Basket.objects.get(basket_owner=request.user)
        context_dict['userAccount'] = userAccount
    except UserAccount.DoesNotExist:
        return HttpResponse("Error! User or basket failed to load.")

    #Create a new order, append all products in basket to order, and order to user's list, then deduct balance from account
    if userAccount:
        order = Order.objects.create(order_owner=user,time_to_deliver=date.today() + timedelta(days=random.randint(1, 10)))
        for product in basket.products.all():
            order.products_to_deliver.add(product)
        order.save()
        userAccount.orders.add(order)
        userAccount.balance -= basket.total_price
        userAccount.save()

    basket.delete() #Delete basket, will be recreated when new items are added

    return render(request, 'shop/purchase_confirm.html', context=context_dict)    

#Add money to account
@login_required
def edit_balance(request):
    try:
        userAccount = UserAccount.objects.get(user=request.user)
    except UserAccount.DoesNotExist:
        userAccount = None

    if request.method == 'POST':
        form = BalanceForm(request.POST, instance=userAccount)
        if form.is_valid():
            form.save()
            return redirect('/shop/')
    else:
        form = BalanceForm(instance=userAccount)
    return render(request, 'shop/edit_balance.html', {'form': form})

#Add a rating to a product
@login_required
def add_rating(request, product_slug):
    # Retrieve the product by slug
    product = get_object_or_404(Product, slug=product_slug)
    
    if request.method == "POST":
        form = ReviewForm(request.POST)
        if form.is_valid():
            review = form.save(commit=False)
            review.product = product         # Link the review to the product
            review.reviewer = request.user   # Set the reviewer to the current user
            review.save()

            reviews = Review.objects.filter(product=product)
            ratings = [r.rating for r in reviews]
            product.average_rating = round(statistics.mean(ratings), 2)
            product.save()

            # Redirect to the product detail page after saving
            return redirect('shop:view_product', product_name_slug=product.slug)
    else:
        form = ReviewForm()
    
    context = {
        'form': form,
        'product': product,
    }
    return render(request, 'shop/add_rating.html', context=context)

# Allows user to view details of account
@login_required
def view_account(request):
    context_dict = {}
    context_dict['user'] = request.user
    context_dict['userAccount'] = UserAccount.objects.get(user=request.user)

    return render(request, 'shop/account.html', context_dict)

#Allows user to change first name and last name
class ChangeUserName(View):
    @login_required
    def get(self, request):
        username = request.GET['userId']
        fname = request.GET['fname']
        sname = request.GET['sname']

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return HttpResponse()
        except ValueError:
            return HttpResponse()
        
        user.first_name = fname
        user.last_name = sname
        user.save()

        return HttpResponse()

#Increments views attribute of the product model
@csrf_protect
def add_views(request):
    if request.method == "POST":
        prod_id = request.POST.get('prod_id')
        try:
            product = Product.objects.get(product_ID = prod_id)
            product.views += 1
            product.save()
            return JsonResponse({'success':True})
        except product.DoesNotExist:
            return JsonResponse({'success': False})
    return JsonResponse({'success': False})

#Change User objects first name and last name
@login_required
def user_change_full_name(request):
    context_dict = {}

    if request.method == "POST":
        form = ChangeUserFullnameForm(request.POST)
        if form.is_valid():
            user = User.objects.get(id=request.user.id)
            user.first_name = form.cleaned_data['first_name']
            user.last_name = form.cleaned_data['last_name']
            user.save()
            return redirect('shop:view_account')
    else:
        form = ChangeUserFullnameForm()
    
    context_dict['form'] = form
    context_dict['change'] = "Change Full Name"

    return render(request, 'shop/change_account_info.html', context=context_dict)

#Views used to change attributes of User or UserAccount. All very similar. 
@login_required
def user_change_username(request):
    context_dict = {}

    if request.method == "POST":
        form = ChangeUsernameForm(request.POST)
        if form.is_valid():
            user = User.objects.get(id=request.user.id)
            user.username = form.cleaned_data["username"]
            user.save()
            return redirect('shop:view_account')
    else:
        form = ChangeUsernameForm()

    context_dict['form'] = form
    context_dict['change'] = "Change Username"
    
    return render(request, 'shop/change_account_info.html', context=context_dict)

@login_required
def become_a_seller(request):
    context_dict ={}

    if request.method == "POST":
        form = BecomeASellerForm(request.POST)
        if form.is_valid():
            user = UserAccount.objects.get(user=request.user)
            user.seller_account = True
            user.save()
            return redirect('shop:view_account')
    else:
        form = BecomeASellerForm(request.POST)
    
    context_dict['form'] = form
    context_dict['change'] = "Become a Seller"
    context_dict['message'] = "Clicking this button will make you a seller, allowing you to sell products on our site. This is a quick warning that we take 92 percent of profits from transactions. To proceed please click the submit button."

    return render(request, 'shop/change_account_info.html', context=context_dict)

@login_required
def change_profile_img(request):
    context_dict = {}
    if request.method == "POST":
        form = ChangeProfileImgForm(request.POST, request.FILES)
        if form.is_valid():
            user = UserAccount.objects.get(user=request.user)
            if(user.account_img != "default.svg"): user.account_img.delete()
            user.account_img = form.cleaned_data['img']
            user.save()
            return redirect('shop:view_account')
    else:
        form = ChangeProfileImgForm()

    context_dict['form'] = form
    context_dict['change'] = "Change Profile Picture"

    return render(request, 'shop/change_account_info.html', context=context_dict)

@login_required
def change_balance(request):
    context_dict = {}
    if request.method == "POST":
        form = ChangeBalanceForm(request.POST)
        if form.is_valid():
            user = UserAccount.objects.get(user=request.user)
            user.balance += form.cleaned_data['balance']
            user.save()
            return redirect('shop:view_account')
    else:
        form = ChangeBalanceForm()

    context_dict['form'] = form
    context_dict['change'] = "Change Balance"
    context_dict['message'] = "Don't worry, we ALWAYS have your payment info :)"

    return render(request, 'shop/change_account_info.html', context=context_dict)

#View the orders made by a specific user
@login_required
def view_orders(request):
    context_dict = {}
    user = UserAccount.objects.get(user=request.user)
    
    context_dict['orders'] = user.orders

    return render(request, 'shop/view_orders.html', context=context_dict)