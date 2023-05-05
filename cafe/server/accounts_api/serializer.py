from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers

from .models import Profile


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        token['is_superuser'] = user.is_superuser
        token['is_staff'] = user.is_staff
        token['is_active'] = user.is_active
        return token


class ProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = Profile
        fields = "__all__"