from django.urls import path

from rest_framework_simplejwt.views import (
    TokenRefreshView, )

from .views.register_view import Register
from .views.confirmation_view import ConfirmAccount
from .views.token_view import MyTokenObtainPairView
from .views.profile_view import DetailedProfile

urlpatterns = [
    path('register/', Register.as_view()),
    path('register/confirm/', ConfirmAccount.as_view()),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/<str:username>/', DetailedProfile.as_view()),
]