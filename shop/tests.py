from django.test import TestCase
from django.contrib.auth.models import User
from django.urls import reverse
from django.test import RequestFactory

from shop.forms import ProductForm, SearchForm
from shop.models import Basket, Category, Order, Product, Review, UserAccount, Wishlist

# Model Tests

#Category Tests
#   Test that the category name works
#   Test that a propery slug is created
class CategoryModelTests(TestCase):
    def test_ensure_unique_name(self):
        category = add_category()
        self.assertEqual((category.name == "test"), True)

    def test_category_slug(self):
        category = add_category(name="Unique and Interesting")
        self.assertEqual((category.slug == "unique-and-interesting"), True)

#User Account Tests
    #Test that the placeholder image is properly added
    #Test that an account can't have a negative balance
class UserAccountModelTests(TestCase):
    def test_create_account_no_img(self):
        testUser = add_user()
        account = add_user_account(testUser)

        self.assertEqual((account.account_img == 'profile_img/default.jpg'), True)

    def test_account_positive_balance(self):
        testUser = add_user()
        account = add_user_account(user=testUser, balance=-1)

        self.assertEqual((account.balance == 0), True)

#Review Tests
    #Test that a rating can't be less than 0
    #Test that a rating can't be greater than 5
class ReviewModelTests(TestCase):
    def test_min_rating(self):
        testUser = add_user()
        testCategory = add_category()
        testProduct = add_product(testUser, testCategory)
        
        review = add_review(reviewer=testUser,product=testProduct,rating=-3)

        self.assertEquals((review.rating == 0), True)

    def test_max_rating(self):
        testUser = add_user()
        testCategory = add_category()
        testProduct = add_product(testUser, testCategory)
        
        review = add_review(reviewer=testUser,product=testProduct,rating=5)

        self.assertEquals((review.rating == 5), True)

#Product Tests
    #Test that a price can't be less than a single penny
    #Test that a product can't have less than one item in stock
    #Test that a rating must be greater than zero
    #Test that a rating must be less than five
    #Test that a product must have at minimum zero views
    #Test that a product uses the placeholder image if none is provided
    #Test that product slug properly works
class ProductModelTests(TestCase):
    def test_min_price(self):
        testUser = add_user()
        testCategory = add_category()
        testProduct = add_product(seller=testUser, category=testCategory, price=-3)
        
        self.assertEquals((testProduct.price == 0.01), True)

    def test_min_quantity(self):
        testUser = add_user()
        testCategory = add_category()
        testProduct = add_product(seller=testUser, category=testCategory, quantity=-3)
        
        self.assertEquals((testProduct.quantity == 1), True)

    def test_min_rating(self):
        testUser = add_user()
        testCategory = add_category()
        testProduct = add_product(seller=testUser, category=testCategory, average_rating=-3)
        
        self.assertEquals((testProduct.average_rating == 0), True)

    def test_max_rating(self):
        testUser = add_user()
        testCategory = add_category()
        testProduct = add_product(seller=testUser, category=testCategory, average_rating=8)
        
        self.assertEquals((testProduct.average_rating == 5), True)

    def test_min_views(self):
        testUser = add_user()
        testCategory = add_category()
        testProduct = add_product(seller=testUser, category=testCategory, views=-3)
        
        self.assertEquals((testProduct.views == 0), True)

    def test_default_img(self):
        testUser = add_user()
        testCategory = add_category()
        testProduct = add_product(seller=testUser, category=testCategory)
        
        self.assertEquals((testProduct.image_reference == 'product_img/placeholder.jpg'), True)

    def test_product_slug(self):
        testUser = add_user()
        testCategory = add_category()
        testProduct = add_product(seller=testUser, category=testCategory)
        
        self.assertEquals((testProduct.slug == "test-product-name"), True)

#Wishlist Tests
    #Test adding a product to the wishlist
    #Test adding two products to the wishlist
class WishlistModelTests(TestCase):
    def test_add_product(self):
        testUser = add_user()
        testCategory = add_category()
        testProduct = add_product(seller=testUser, category=testCategory)

        wishlist=add_wishlist(wishlist_owner=testUser,products=[testProduct])

        self.assertEquals((len(wishlist.products.all()) == 1),True)

    def test_add_two_products(self):
        testUser = add_user()
        testCategory = add_category()
        testProduct = add_product(seller=testUser, category=testCategory)
        testProduct2 = add_product(seller=testUser, category=testCategory, product_name="test2")

        wishlist=add_wishlist(wishlist_owner=testUser,products=[testProduct, testProduct2])

        self.assertEquals((len(wishlist.products.all()) == 2),True)

#Basket Tests
    #Test adding a product to basket
    #Test adding two products to a basekt
class BasketModelTest(TestCase):
    def test_add_product(self):
        testUser = add_user()
        testCategory = add_category()
        testProduct = add_product(seller=testUser, category=testCategory)

        basket=add_basket(basket_owner=testUser,products=[testProduct])

        self.assertEquals((len(basket.products.all()) == 1), True)

    def test_add_two_products(self):
        testUser = add_user()
        testCategory = add_category()
        testProduct = add_product(seller=testUser, category=testCategory)
        testProduct2 = add_product(seller=testUser, category=testCategory, product_name="test2")

        basket=add_basket(basket_owner=testUser,products=[testProduct, testProduct2])

        self.assertEquals((len(basket.products.all()) == 2), True)

#Order Tests
    #Test adding 1 product to order
    #Test adding 2 products to order
class OrderModelTests(TestCase):
    def test_add_product(self):
        testUser = add_user()
        testCategory = add_category()
        testProduct = add_product(seller=testUser, category=testCategory)

        order=add_order(order_owner=testUser,products=[testProduct])

        self.assertEquals((len(order.products_to_deliver.all()) == 1), True)

    def test_add_two_products(self):
        testUser = add_user()
        testCategory = add_category()
        testProduct = add_product(seller=testUser, category=testCategory)
        testProduct2 = add_product(seller=testUser, category=testCategory, product_name="test2")

        order=add_order(order_owner=testUser,products=[testProduct, testProduct2])

        self.assertEquals((len(order.products_to_deliver.all()) == 2), True)

#Views Tests
class TestHomepage(TestCase):
    def test_homepage(self):
        test_user = add_user()
        test_category = add_category()
        testProduct = add_product(seller=test_user, category=test_category, product_name="test")
        testProduct2 = add_product(seller=test_user, category=test_category, product_name="test2")
        testProduct3 = add_product(seller=test_user, category=test_category, product_name="test3")
        testProduct4 = add_product(seller=test_user, category=test_category, product_name="test4")

        response = self.client.get(reverse('shop:homepage'))    

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.context['most_viewed_products']), 4)
        self.assertContains(response, "test")

class TestViewProduct(TestCase):

    def setUp(self):
        self.test_user = add_user()
        self.test_category = add_category()
        self.test_product = add_product(seller=self.test_user, category=self.test_category,product_name="banana")

    def test_product_no_reviews(self):
        response = self.client.get(reverse('shop:view_product', kwargs={'product_name_slug':self.test_product.slug}))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.context['reviews']), 0)
        self.assertContains(response, "banana")

    def test_product_with_reviews(self):
        test_review1 = add_review(reviewer=self.test_user,product=self.test_product,rating=3,comment="test")
        test_review2 = add_review(reviewer=self.test_user,product=self.test_product,rating=3,comment="test2")
        test_review3 = add_review(reviewer=self.test_user,product=self.test_product,rating=3,comment="test3")

        response = self.client.get(reverse('shop:view_product', kwargs={'product_name_slug':self.test_product.slug}))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.context['reviews']), 3)
        self.assertContains(response, "banana")

class TestViewCategory(TestCase):
    def test_unknown_category(self):
        
        response = self.client.get(reverse('shop:view_category', kwargs={'category_name_slug':'empty'}))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.context['products'], None)
        self.assertEqual(response.context['message'], "Unknown Category")

    def test_category(self):
        test_user = add_user()
        test_category = add_category(name="bananas")
        test_product = add_product(seller=test_user, category=test_category,product_name="banana")
        test_product2 = add_product(seller=test_user, category=test_category,product_name="banana2")

        response = self.client.get(reverse('shop:view_category', kwargs={'category_name_slug':"bananas"}))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.context['products']), 2)
        self.assertEqual(response.context['message'], "bananas")

class TestSearch(TestCase):

    def setUp(self):
        self.test_user = add_user()
        self.test_category = add_category()
        self.test_product = add_product(seller=self.test_user, category=self.test_category,product_name="potato")
        self.test_product2 = add_product(seller=self.test_user, category=self.test_category,product_name="potash")
        self.test_product3 = add_product(seller=self.test_user, category=self.test_category,product_name="banana")

        self.form_data = {
            'search': 'pot',
        }

    def test_empty_search(self):

        response = self.client.get(reverse('shop:search'))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Search")
        self.assertEqual(set(response.context['products']),{self.test_product, self.test_product2, self.test_product3})

    def test_with_search(self):

        form = SearchForm(data=self.form_data)

        self.assertTrue(form.is_valid())

        response = self.client.post(reverse('shop:search'), self.form_data)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(set(response.context['products']),{self.test_product,self.test_product2})

#Having issues getting the form for this working, will have another look later
class TestAddProduct(TestCase):

    def setUp(self):
        self.test_user = add_user()
        self.client.force_login(self.test_user)
        self.test_category = add_category()

        self.form_data = {
            'product_name':"potash",
            'price':3.02,
            'description':'test',
            'category':self.test_category.id,
        }

    def test_add_product(self):
        form = ProductForm(data=self.form_data)
        self.assertTrue(form.is_valid())

        response = self.client.post(reverse('shop:add_product'), self.form_data)

        self.assertEqual(response.status_code,302)
        self.assertEqual(Product.objects.get(product_name="potash").category, self.test_category)

class TestWishlist(TestCase):
    def setUp(self):
        self.test_user = add_user()
        self.client.force_login(self.test_user)
        self.test_category = add_category()
        self.test_product = add_product(seller=self.test_user, category=self.test_category)
        self.test_product2 = add_product(seller=self.test_user, category=self.test_category, product_name="test2")
        self.test_product3 = add_product(seller=self.test_user, category=self.test_category, product_name="test3")

        self.wishlist = add_wishlist(wishlist_owner=self.test_user)

    def test_empty_wishlist(self):
        response = self.client.get(reverse('shop:wishlist_detail'))

        self.assertEqual(response.status_code,200)
        self.assertTemplateUsed(response, 'shop/basket.html')
        self.assertEqual(len(response.context['products']), 0)
        self.assertContains(response, "Wishlist")

    def test_filled_wishlist(self):
        self.wishlist.products.add(self.test_product)
        self.wishlist.products.add(self.test_product2)
        self.wishlist.products.add(self.test_product3)

        response = self.client.get(reverse('shop:wishlist_detail'))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(set(response.context['products']), {self.test_product, self.test_product2, self.test_product3})

class TestBasket(TestCase):
    def setUp(self):
        self.test_user = add_user()
        self.client.force_login(self.test_user)
        self.test_category = add_category()
        self.test_product = add_product(seller=self.test_user, category=self.test_category)
        self.test_product2 = add_product(seller=self.test_user, category=self.test_category, product_name="test2")
        self.test_product3 = add_product(seller=self.test_user, category=self.test_category, product_name="test3")

        self.basket = add_basket(basket_owner=self.test_user)

    def test_empty_basket(self):
        response = self.client.get(reverse('shop:basket_detail'))

        self.assertEqual(response.status_code,200)
        self.assertTemplateUsed(response, 'shop/basket.html')
        self.assertEqual(len(response.context['products']), 0)
        self.assertContains(response, "Basket")

    def test_filled_wishlist(self):
        self.basket.products.add(self.test_product)
        self.basket.products.add(self.test_product2)
        self.basket.products.add(self.test_product3)

        response = self.client.get(reverse('shop:basket_detail'))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(set(response.context['products']), {self.test_product, self.test_product2, self.test_product3})

class TestPurchase(TestCase):
    def setUp(self):
        self.test_user = add_user()
        self.client.force_login(self.test_user)
        self.test_category = add_category()
        self.test_product = add_product(seller=self.test_user, category=self.test_category)
        self.test_product2 = add_product(seller=self.test_user, category=self.test_category, product_name="test2")
        self.test_product3 = add_product(seller=self.test_user, category=self.test_category, product_name="test3")

        self.basket = add_basket(basket_owner=self.test_user)
        self.basket.products.add(self.test_product)
        self.basket.products.add(self.test_product2)
        self.basket.products.add(self.test_product3)

    def test_checkout_detail_insufficient_balance(self):
        self.test_account = add_user_account(user=self.test_user, balance=0)
        
        response = self.client.get(reverse('shop:checkout_detail'))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.context['valid'], False)

    def test_checkout_detail_sufficient_balance(self):
        self.test_account = add_user_account(user=self.test_user, balance=9_000_000)
        
        response = self.client.get(reverse('shop:checkout_detail'))

        print(self.test_account.user)
        print(response.context['products'])

        self.assertEqual(response.status_code, 200)
        self.assertEqual(set(response.context['products']), {self.test_product, self.test_product2, self.test_product3})
        self.assertEqual(response.context['basket'], self.basket)

    def test_purchase_confirm_no_useraccount(self):
        response = self.client.get(reverse('shop:purchase_confirm'))

        self.assertContains(response, "Error! User or basket failed to load.")

    def test_purchase_confirm_with_useraccount(self):
        self.test_account = add_user_account(user=self.test_user, balance=9_000_000)
        old_basket = set(Basket.objects.all())
        response = self.client.get(reverse('shop:checkout_detail'))
        print(response.context['userAccount'])
        self.assertNotEqual(set(Basket.objects.all()), old_basket)

# Helper Methods
def add_user(username="testUsername", email="test@test.com", password="testPassword"):
    user = User.objects.get_or_create(username=username, email=email, password=password)[0]
    user.save()
    return user

def add_category(name="test"):
    category = Category.objects.get_or_create(name=name)[0]
    category.save()
    return category

def add_product(seller, category, product_name="Test Product Name", price=1,quantity=1,average_rating=0,views=0,description="test"):
    product = Product.objects.get_or_create(seller=seller,
                                        category=category,
                                        product_name=product_name,
                                        price=price,
                                        quantity=quantity,
                                        average_rating=average_rating,
                                        views=views,
                                        description=description)[0]
    product.save()
    return product

def add_basket(basket_owner, products=[]):
    basket = Basket.objects.get_or_create(basket_owner = basket_owner)[0]

    for product in products:
        basket.products.add(product)

    basket.save()
    return basket

def add_wishlist(wishlist_owner, products=[]):
    wishlist = Wishlist.objects.get_or_create(wishlist_owner=wishlist_owner)[0]

    for product in products:
        wishlist.products.add(product)

    wishlist.save()

    return wishlist

def add_order(order_owner, products=[]):
    order = Order.objects.get_or_create(order_owner=order_owner)[0]

    for product in products:
        order.products_to_deliver.add(product)

    order.save()
    
    return order

def add_user_account(user,seller_account=False,balance=0):
    user_account = UserAccount.objects.get_or_create(user=user,
                                                     seller_account=seller_account,
                                                     balance=balance)[0]
    user_account.save()

    return user_account

def add_review(reviewer,product,rating=0,comment="test"):
    review = Review.objects.get_or_create(reviewer=reviewer,
                                          product=product,
                                          rating=rating,
                                          comment=comment)[0]
    review.save()

    return review