from django.contrib import admin
from django.urls import path
from sales_api.views import SalesByLocation

urlpatterns = [
    path('sales-by-location', SalesByLocation.as_view()),
]