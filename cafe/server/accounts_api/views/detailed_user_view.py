from rest_framework.views import APIView

from rest_framework.response import Response
from rest_framework import status

from accounts_api.serializer import UserSerializer

from helpers.check_user_permission import check_user_permission
from django.contrib.auth import get_user_model

User = get_user_model()


class DetailedUser(APIView):

    def put(self, request, pk):
        try:
            if not check_user_permission(request, 'admin'):
                return Response(
                    {'auth': 'You are not authorized to view this page'},
                    status=status.HTTP_401_UNAUTHORIZED)

            user = User.objects.get(id=pk)
            serialized_user = UserSerializer(user,
                                             data=request.data,
                                             partial=True)

            if serialized_user.is_valid():
                serialized_user.save()
                return Response(serialized_user.data,
                                status=status.HTTP_200_OK)
            else:
                return Response(serialized_user.errors,
                                status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({'error': 'Something went wrong'},
                            status=status.HTTP_400_BAD_REQUEST)
