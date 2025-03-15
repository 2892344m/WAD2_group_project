from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404

from shop.models import Wishlist
from shop.models import Product, Category
from shop.forms import ProductForm, SearchForm

#Collects the Top 5 most viewed and most recently added pages, then sends them to the homepage to display
#Also sends a list of all categories
def homepage(request):
    context_dict = {}
    context_dict['most_viewed_products'] = Product.objects.order_by('-views')[:4]
    context_dict['recently_added_products'] = Product.objects.order_by('-date_added')[:4]
    context_dict['category_list'] = Category.objects.order_by()

    return render(request, 'shop/homepage.html', context=context_dict)

#This collects information on a requested product to be displayed for the user
#The URL is in the form: http://127.0.0.1:8000/shop/view_product/<product_name_slug>/
def view_product(request, product_name_slug):

    context_dict = {}

    try:
        product = Product.objects.get(slug=product_name_slug)
        context_dict['product'] = product
    except Product.DoesNotExist:
        product = None  

    if product is None:
        return redirect('/shop/')

    return render(request, 'shop/view_product.html', context=context_dict)

#Displays all products present within a category
def view_category(request, category_name_slug):
    context_dict = {}

    try:
        category = Category.objects.get(slug=category_name_slug)
        products = Product.objects.filter(category=category)
        context_dict['products'] = products
        context_dict['category'] = category
    except Category.DoesNotExist:
        context_dict['products'] = None
        context_dict['category'] = None

    return render(request, 'shop/category.html', context=context_dict)

#Displays producst based on search input
def search(request):
    print(request)
    print(type(request))
    context_dict = {}

    if request.method == 'POST':
        form = SearchForm(request.POST)
        if form.is_valid():
            #Takes in a search query from the user
            #Compares the set of characters in the search with the set of characters of the product, if less then appends to the filtered product list
            #Finally, return the new product list to be displayed on the page
            search_query = form.cleaned_data['search']
            products = Product.objects.order_by()
            filtered_products = []
            for product in products:
                if set(search_query.lower()) <= set(product.product_name.lower()):
                    filtered_products.append(product)

            context_dict['form'] = form
            context_dict['products'] = filtered_products

            return render(request, 'shop/search.html', context=context_dict)
    else:
        form = SearchForm()

    context_dict['form'] = form
    context_dict['products'] = Product.objects.order_by()

    return render(request, 'shop/search.html', context=context_dict)

#This allows a seller to add a product to the shop
@login_required
def add_product(request):

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
    return render(request, 'shop/add_product.html', {'form': form})


@login_required
def wishlist_detail(request):
    wishlist, created = Wishlist.objects.get_or_create(wishlist_owner=request.user)
    return render(request, 'shop/wishlist.html', {'wishlist': wishlist, 'products': wishlist.products.all()})

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