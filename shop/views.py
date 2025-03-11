from django.shortcuts import render, redirect
from django.http import HttpResponse
from shop.models import Product
from shop.forms import ProductForm


#View for the home page
def homepage(request):
    return render(request, 'shop/homepage.html')

#This collects information on a requested product to be displayed for the user
#The URL is in the form: http://127.0.0.1:8000/shop/view_product/<Product_ID>/
def view_product(request, product_ID):

    try:
        product = Product.objects.get(product_ID=int(product_ID))
    except Product.DoesNotExist:
        product = None

    if product is None:
        return redirect('/shop/')

    return render(request, 'shop/view_product.html', {'product': product})


#This allows a seller to add a product to the shop
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


