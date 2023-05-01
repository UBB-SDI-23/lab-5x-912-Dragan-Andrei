from django.urls import path

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views.register_view import Register
from .views.confirmation_view import ConfirmAccount

urlpatterns = [
    path('register/', Register.as_view()),
    path('register/confirm/', ConfirmAccount.as_view()),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]