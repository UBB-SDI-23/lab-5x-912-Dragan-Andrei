from django.urls import path
from .views.all_sales_view import Sales
from .views.sales_scripts_view import ScriptingSales

# Create the url endpoints for the sale API
urlpatterns = [
    path('all', Sales.as_view()),
    path('admin/scripts/', ScriptingSales.as_view()),
]