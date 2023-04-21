from django.urls import path
from .views.coffees_view import Coffees
from .views.detailed_coffee_view import CoffeeDetail
from .views.coffees_autocomplete_view import CoffeesAutocomplete

urlpatterns = [
    path('', Coffees.as_view()),
    path('autocomplete', CoffeesAutocomplete.as_view()),
    path('<int:pk>', CoffeeDetail.as_view()),
]
