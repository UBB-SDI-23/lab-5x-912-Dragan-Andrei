from django.contrib import admin
from django.urls import path
from .views.all_sales_view import Sales

# Create the url endpoints for the sale API
urlpatterns = [
    path('all', Sales.as_view()),
]