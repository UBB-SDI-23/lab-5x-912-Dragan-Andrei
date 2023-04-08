from django.contrib import admin
from django.urls import path
from blends_api.views import Blends, BlendDetail, BlendsAutocomplete

# Create the url endpoints for the coffee API
urlpatterns = [
    path('', Blends.as_view()),
    path('autocomplete', BlendsAutocomplete.as_view()),
    path('<int:pk>', BlendDetail.as_view())
]
