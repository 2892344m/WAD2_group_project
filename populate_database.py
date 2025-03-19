import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE",
                      "tango_with_django_project.settings")

import django
from django.template.defaultfilters import slugify

django.setup()
from shop.models import Product, Category, User, Review, UserAccount
from datetime import date

def populate():    

    users = [ {'name':'Bob',
              'email':'Bob@SellerAccount.com',
              'password':'BobPassword'},
              {'name':'Steve',
               'email': 'Steve@BuyerAccount.com',
               'password': 'StevePassword'},
              {'name':'Mary',
               'email': 'Mary@BuyerAccount.com',
               'password': 'MaryPassword',},
              {'name':'Admin',
               'email':'Admin@AdminAccount.com',
               'password': 'AdminPassword'}]
    
    user_accounts = {'Bob': {'seller_account':True,
                            'balance': 3232},
                    'Steve':{'seller_account':False,
                             'balance': 234,},
                    'Mary': {'seller_account':False,
                             'balance': 438},
                    'Admin':{'seller_account':True,
                             'balance': 9999}}
    
    for user in users:
        u = add_user(user)
        add_user_account(u, user_accounts[user['name']])

    test_user = User.objects.get(username='Bob')
    reviewer_one = User.objects.get(username='Steve')
    reviewer_two = User.objects.get(username='Mary')

    #Setup products and categories
    tools = [{'product_name':'Hammer',
              'price': 12,
              'quantity': 124,
              'average_rating': 2.4,
              'image_reference': 'product_img/hammer.jpg',
              'seller': test_user,
              'views': 326,
              'date_added': date.today,
              'description': 'A hardy hammer!'
              },
              {'product_name':'Wrench',
               'price': 20,
               'quantity': 300,
               'average_rating': 3,
               'image_reference': 'product_img/wrench.jpg',
               'seller': test_user,
               'views': 326,
               'date_added': date.today,
               'description': 'A reliable wrench.'}]
    
    household_appliances = [{'product_name':'Washing Machine',
                             'price': 150,
                             'quantity': 62,
                             'average_rating': 5,
                             'image_reference': 'product_img/washing_machine.jpg',
                             'seller': test_user,
                             'views': 1284,
                             'date_added': date.today,
                             'description': 'The ultimate washing machine.'},
                             {'product_name':'Oven',
                              'price': 300,
                              'quantity':22,
                              'average_rating':1.2,
                              'image_reference': 'product_img/oven.jpg',
                              'seller': test_user,
                              'views': 3028,
                              'date_added': date.today,
                              'description': 'A nice, shiny new oven!'},]
    
    electronics = [{'product_name':'Laptop',
                    'price': 500,
                    'quantity': 32,
                    'average_rating': 4.5,
                    'image_reference': 'product_img/laptop.jpg',
                    'seller': test_user,
                    'views': 125,
                    'date_added': date.today,
                    'description': 'A functional laptop.'},
                    {'product_name':'Universal TV Remote',
                     'price': 15,
                     'quantity': 1023,
                     'average_rating': 1.2,
                     'image_reference': 'product_img/remote.jpg',
                     'seller': test_user,
                     'views': 125,
                     'date_added': date.today,
                     'description': "The ultimate TV Remote."}]
    
    hardware = [{'product_name':'3200 Series Noveed GPU',
                 'price': 9000,
                 'quantity': 2,
                 'average_rating': 0.3,
                 'image_reference': 'product_img/graphics.jpg',
                 'seller': test_user,
                 'views': 23723,
                 'date_added': date.today,
                 'description': 'A brand new GPU.'},
                 {'product_name':'HJXMDASH42 AZOOS Motherboard',
                  'price': 250,
                  'quantity': 47,
                  'average_rating': 3.8,
                  'image_reference': 'product_img/motherboard.jpg',
                  'seller': test_user,
                  'views': 3208,
                  'date_added': date.today,
                  'description': 'A second-hand motherboard',
                  }]
    
    misc = [{'product_name':'CardboardBox Controller',
             'price': 50,
             'quantity': 37,
             'average_rating': 4.2,
             'image_reference': 'product_img/controller.jpg',
             'seller': test_user,
             'views': 273,
             'date_added': date.today,
             'description': 'A spare controller for your CardboardBox console.'},
             {'product_name':'Sellotape',
              'price': 3,
              'quantity': 247,
              'average_rating': 3.2,
              'image_reference': 'product_img/sellotape.jpg',
              'seller': test_user,
              'views': 273,
              'date_added': date.today,
              'description': "Stick sellotape!"}]
    
    computer_accessories = [{'product_name':'AZOOS Keyboard',
                             'price': 40,
                             'quantity': 246,
                             'average_rating': 2.4,
                             'image_reference': 'product_img/keyboard.jpg',
                             'seller': test_user,
                             'views': 212,
                             'date_added': date.today,
                             'description': 'A top of the line AZOOS keyboard.'},
                             {'product_name': "AMDUH Mouse",
                              'price': 15,
                              'quantity': 123,
                              'average_rating': 2.4,
                              'image_reference': 'product_img/mouse.jpg',
                              'seller': test_user,
                              'views': 273,
                              'date_added': date.today,
                              'description': 'A fancy new mouse.'}]
    
    categories = {'Tools':tools,
                  'Household Appliances':household_appliances,
                  'Electronics': electronics,
                  'Hardware': hardware,
                  'Misc.': misc,
                  'Computer Accessories': computer_accessories,}
    
    for cat, products in categories.items():
        c = add_cat(cat)
        for product in products:
            add_product(product, c)
    
    #Create product reviews
    reviews = {reviewer_one:[  {'product':'AZOOS Keyboard',
                                'rating': 3,
                                'comment': 'Good keyboard',},
                                {'product':'CardboardBox Controller',
                                'rating': 1,
                                'comment': 'Bad controller',},
                                {'product':'3200 Series Noveed GPU',
                                'rating': 1,
                                'comment': 'Bad and expensive >:(',},
                                {'product':'Laptop',
                                'rating': 5,
                                'comment': 'Fancy and new!'},
                                {'product':'Washing Machine',
                                 'rating': 3,
                                 'comment': 'Pretty good'},
                                {'product':'Hammer',
                                 'rating': 5,
                                 'comment': 'Yup, its a hammer'}
                            ],
                reviewer_two:[{'product':'AMDUH Mouse',
                               'rating': 4,
                               'comment': 'Good mouse',},
                               {'product':'Sellotape',
                               'rating': 5,
                               'comment': 'Tape. Sellotape.'},
                               {'product':'HJXMDASH42 AZOOS Motherboard',
                                'rating':3,
                                'comment':'Eh, its alright'},
                                {'product':'Universal TV Remote',
                                 'rating':0,
                                 'comment':'This is genuinely awful. Never works'},
                                 {'product':'Oven',
                                 'rating':5,
                                 'comment':'Damn good oven',},
                                 {'product':'Wrench',
                                  'rating':1,
                                  'comment': 'Yup, its a wrench.'}]
                }
    
    for reviewer, reviews in reviews.items():
        for review in reviews:
            add_review(reviewer, review)


def add_cat(cat):
    c = Category.objects.get_or_create(name = cat)[0]
    c.save()
    return c

def add_product(product, c):
    p = Product.objects.get_or_create(product_name = product['product_name'],
                                      seller = product['seller'],
                                      category = c,
                                      price = product['price'],
                                      quantity = product['quantity'],
                                      average_rating = product['average_rating'],
                                      image_reference = product['image_reference'],
                                      views = product['views'],
                                    #   date_added = product['date_added'],
                                      description = product['description'],
                                      )[0]
    p.save()
    
def add_review(reviewer, review):
    r = Review.objects.get_or_create(reviewer = reviewer,
                              product = Product.objects.get(product_name=review['product']),
                              rating = review['rating'],
                              comment = review['comment']
                              )[0]
    r.save()
    
def add_user(user):
    try:
        if user['name'] == 'Admin':
            u =User.objects.create_superuser(user['name'], user['email'], user['password'])
        else:
            u =User.objects.create_user(user['name'], user['email'], user['password'])
    except:
        u = User.objects.get(username=user['name'])
    return u

def add_user_account(user, user_account):
    USER_PLACEHOLDER_IMG = 'profile_img/default.svg'
    u = UserAccount.objects.get_or_create(user=user, 
                                          seller_account=user_account['seller_account'],
                                          balance=user_account['balance'],
                                          account_img = USER_PLACEHOLDER_IMG)

if __name__ == "__main__":
    print("Starting Rango Population script...")
    populate()