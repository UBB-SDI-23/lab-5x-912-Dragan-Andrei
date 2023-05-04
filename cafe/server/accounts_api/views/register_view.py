from rest_framework.views import APIView
from rest_framework.response import Response

from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model

from rest_framework import status
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

from django.urls import reverse
from datetime import datetime, timedelta
import pytz
import random
import string

from ..models import Profile

User = get_user_model()


class Register(APIView):

    def post(self, request):
        username = request.data.get('username', None)
        password = request.data.get('password', None)

        # check if the username is already taken
        if User.objects.filter(username=username).exists():
            return Response({'username': 'Username already taken'},
                            status=status.HTTP_400_BAD_REQUEST)

        # validate password
        try:
            validate_password(password)
        except ValidationError as e:
            return Response({'password': e.messages},
                            status=status.HTTP_400_BAD_REQUEST)

        # create new user
        user = User.objects.create_user(username=username,
                                        password=password,
                                        is_active=False)

        # generate confirmation code
        confirmation_code = ''.join(
            random.choices(string.ascii_uppercase + string.digits, k=12))

        # set confirmation code valid until 10 minutes from now
        confirmation_code_valid_until = datetime.now(
            pytz.utc) + timedelta(minutes=10)

        # store confirmation code and its validity time in user profile table
        user_profile = Profile.objects.create(
            confirmation_code=confirmation_code,
            confirmation_code_valid_until=confirmation_code_valid_until,
            user_id=user)

        # send the confirmation code to the frontend
        return Response({'confirmation_code': confirmation_code})