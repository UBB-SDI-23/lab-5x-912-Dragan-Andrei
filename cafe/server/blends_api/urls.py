from django.contrib import admin
from django.urls import path
from .views.blends_view import Blends
from .views.detailed_blend_view import BlendDetail
from .views.blends_autocomplete_view import BlendsAutocomplete

# Create the url endpoints for the coffee API
urlpatterns = [
    path('', Blends.as_view()),
    path('autocomplete', BlendsAutocomplete.as_view()),
    path('<int:pk>', BlendDetail.as_view())
]
