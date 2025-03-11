from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required

from shop.models import Product, Category
from shop.forms import ProductForm

#Collects the Top 5 most viewed and most recently added pages, then sends them to the homepage to display
#Also sends a list of all categories
def homepage(request):
    context_dict = {}
    context_dict['most_viewed_products'] = Product.objects.order_by('-views')
    context_dict['recently_added_products'] = Product.objects.order_by('-date_added')
    context_dict['category_list'] = Category.objects

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


