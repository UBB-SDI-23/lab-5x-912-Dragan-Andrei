from django.contrib import admin
from django.urls import path
from coffees_api.views import Coffees, CoffeeDetail, OtherCoffeesByBlends

# Create the url endpoints for the coffee API
# All those endpoints are prefixed by '/coffees/' specified in the main app's urls.py file
urlpatterns = [
    path('', Coffees.as_view()),
    path('<int:pk>', CoffeeDetail.as_view()),
    path('other-coffees-by-blend', OtherCoffeesByBlends.as_view())
]


