from django import template
from shop.models import Category
from shop.forms import SearchForm

register = template.Library()

@register.inclusion_tag('shop/categories.html')
def get_category_list(current_category=None):
    return {'categories': Category.objects.all(),
            'current_category': current_category}