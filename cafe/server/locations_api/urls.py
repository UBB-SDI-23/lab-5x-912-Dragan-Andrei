from django.contrib import admin
from django.urls import path
from .views.detailed_location_view import LocationDetail
from .views.location_sales_view import LocationCoffee
from .views.locations_view import Locations
from .views.sales_by_location import SalesByLocation

# Create the url endpoints for the location API
urlpatterns = [
    path('', Locations.as_view()),
    path('<int:pk>', LocationDetail.as_view()),
    path('<int:pk>/coffees', LocationCoffee.as_view()),
    path('sales-by-location', SalesByLocation.as_view()),
]