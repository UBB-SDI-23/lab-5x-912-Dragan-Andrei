from django.urls import path
from .views.blends_view import Blends
from .views.detailed_blend_view import BlendDetail
from .views.blends_autocomplete_view import BlendsAutocomplete
from .views.blends_by_country_view import BlendsCountry
from .views.blends_scripts_view import ScriptingBlends

# Create the url endpoints for the coffee API
urlpatterns = [
    path('', Blends.as_view()),
    path('autocomplete', BlendsAutocomplete.as_view()),
    path('<int:pk>', BlendDetail.as_view()),
    path('country', BlendsCountry.as_view()),
    path('admin/scripts/', ScriptingBlends.as_view()),
]
