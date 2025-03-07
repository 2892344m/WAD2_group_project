from django.shortcuts import render
from django.http import HttpResponse

#View for the home page
def homepage(request):
    return render(request, 'shop/homepage.html')

#This collects information on a requested product to be displayed for the user
def show_product(request):
    return HttpResponse("This will provide info for a product")

#This allows a seller to add a product to the shop
def add_product(request):
    return HttpResponse("This will add a product")

