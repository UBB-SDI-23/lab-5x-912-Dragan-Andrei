from rest_framework.views import APIView

from accounts_api.models import Profile
from accounts_api.serializer import ProfileSerializer

from rest_framework.response import Response
from rest_framework import status

from django.contrib.auth import get_user_model

User = get_user_model()

from coffees_api.models import Coffee
from blends_api.models import Blend
from locations_api.models import Location
from sales_api.models import Sale

from helpers.check_user_permission import check_user_permission, get_username


class DetailedProfile(APIView):

    def get(self, request, username):
        try:
            # get the user associated with the username
            user = User.objects.get(username=username)

            # get the profile associated with the user
            profile = Profile.objects.get(user_id=user.id)

            serialized_profile = ProfileSerializer(profile)

            # add additional data to the serialized profile
            answer = serialized_profile.data
            answer['username'] = user.username

            answer['no_coffees'] = Coffee.objects.filter(
                user_id=user.id).count()
            answer['no_blends'] = Blend.objects.filter(user_id=user.id).count()
            answer['no_locations'] = Location.objects.filter(
                user_id=user.id).count()
            answer['no_sales'] = Sale.objects.filter(user_id=user.id).count()

            return Response(answer, status=status.HTTP_200_OK)
        except:
            return Response({'error': 'Profile does not exist'},
                            status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, username):
        try:
            if username != get_username(request):
                return Response({'auth': 'You can only edit your own profile'},
                                status=status.HTTP_400_BAD_REQUEST)

            # get the user associated with the username
            user = User.objects.get(username=username)

            # get the profile associated with the user
            profile = Profile.objects.get(user_id=user.id)
            serialized_profile = ProfileSerializer(profile)

            # change only the fields that are provided
            serialized_profile = ProfileSerializer(profile,
                                                   data=request.data,
                                                   partial=True)

            if serialized_profile.is_valid():
                serialized_profile.save()
                return Response(serialized_profile.data,
                                status=status.HTTP_200_OK)
            else:
                return Response(serialized_profile.errors,
                                status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({'error': 'Profile does not exist'},
                            status=status.HTTP_400_BAD_REQUEST)