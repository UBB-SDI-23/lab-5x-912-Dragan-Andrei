from django.contrib import admin
from django.urls import path
from locations_api.views import Locations, LocationDetail, LocationCoffee

# Create the url endpoints for the location API
urlpatterns = [
    path('', Locations.as_view()),
    path('<int:pk>', LocationDetail.as_view()),
    path('<int:pk>/coffees', LocationCoffee.as_view())
]