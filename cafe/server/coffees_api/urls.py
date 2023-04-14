from django.urls import path
from .views.coffees_view import Coffees
from .views.coffee_statistics_view import OtherCoffeesByBlends
from .views.detailed_coffee_view import CoffeeDetail

urlpatterns = [
    path('', Coffees.as_view()),
    path('<int:pk>', CoffeeDetail.as_view()),
    path('other-coffees-by-blend', OtherCoffeesByBlends.as_view())
]
