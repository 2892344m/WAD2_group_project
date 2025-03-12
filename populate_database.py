import os
import random
os.environ.setdefault("DJANGO_SETTINGS_MODULE",
                      "tango_with_django_project.settings")

import django
django.setup()
from shop.models import Product, Category, User
from datetime import date

test_user = User.objects.order_by()[0]

def populate():
    categories = ["Tools", 
                  "Household Appliances", 
                  "Electronics", 
                  "Hardware",
                  "Misc.",
                  "Lighting",
                  "Computer Accessories",]
    
    tools = [{'product_name':'Hammer',
              'price': 127.4,
              'quantity': 124,
              'average_rating': 2.4,
              'image_reference': 'media/hammer.jpg',
              'seller': test_user,
              'views': 326,
              'date_added': date.today,
              'description': 'placeholder'
              }]
    
    for cat in categories:
        c = add_cat(cat)
    
    for tool in tools:
        add_product(tool, c)


def add_cat(cat):
    c = Category.objects.get_or_create(name = cat)[0]
    c.save()
    return c

def add_product(tool, c):
    print(tool)
    p = Product.objects.get_or_create(product_name = tool['product_name'],
                                      seller = tool['seller'],
                                      category = c,
                                      price = tool['price'],
                                      quantity = tool['quantity'],
                                      average_rating = tool['average_rating'],
                                      image_reference = tool['image_reference'],
                                      views = tool['views'],
                                      date_added = tool['date_added'],
                                      description = tool['description'],
                                      )
    
if __name__ == "__main__":
    print("Starting Rango Population script...")
    populate()