from rest_framework.views import APIView

from rest_framework.response import Response
from rest_framework import status

from accounts_api.user_pagination import UserPagination
from accounts_api.serializer import UserSerializer

from helpers.check_user_permission import check_user_permission, get_user_id
from django.contrib.auth import get_user_model

User = get_user_model()


class Users(APIView):

    def get(self, request):
        try:
            # check if the user is an admin
            if not check_user_permission(request, 'admin'):
                return Response(
                    {'auth': 'You are not authorized to view this page'},
                    status=status.HTTP_401_UNAUTHORIZED)

            # get the page number and page size from the query params
            page = int(request.query_params.get('p', 1))
            page_size = int(request.query_params.get('page_size', 10))

            # calculate the offset and limit
            offset = (page - 1) * page_size
            limit = page_size

            # add the offset and limit to the request object as query params
            request.query_params._mutable = True
            request.query_params['offset'] = offset
            request.query_params['limit'] = limit

            # get the users
            users = User.objects.all().order_by('id')

            # remove the current user from the list
            users = users.exclude(id=get_user_id(request))

            paginator = UserPagination()
            paginated_users = paginator.paginate_queryset(users, request)
            serialized_users = UserSerializer(paginated_users, many=True)

            return paginator.get_paginated_response(serialized_users.data)
        except:
            return Response({'error': 'Something went wrong'},
                            status=status.HTTP_400_BAD_REQUEST)
