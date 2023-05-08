from django.contrib import admin
from django.urls import path
from .views.pagination_view import SetPagination

# Create the url endpoints for the location API
urlpatterns = [
    path('page-size', SetPagination.as_view()),
]