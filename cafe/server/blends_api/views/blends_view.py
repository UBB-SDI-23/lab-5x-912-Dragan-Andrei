from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

from blends_api.models import Blend
from blends_api.serializer import BlendSerializer
from blends_api.blend_pagination import BlendPagination

from coffees_api.models import Coffee

from helpers.check_user_permission import check_user_permission, get_user_id
from django.contrib.auth import get_user_model

User = get_user_model()


class Blends(APIView):

    def get(self, request):
        try:
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

            # get the blends
            blends = Blend.objects.all().order_by('-id')
            paginator = BlendPagination()
            paginated_blends = paginator.paginate_queryset(blends, request)
            serialized_blends = BlendSerializer(paginated_blends, many=True)

            # see by how many other coffees the blend is used
            # also get the user's username
            for blend in serialized_blends.data:
                blend['used_by'] = Coffee.objects.filter(
                    blend_id=blend['id']).count()
                blend['username'] = User.objects.get(
                    id=blend['user_id']).username

            return paginator.get_paginated_response(serialized_blends.data)

        except Exception as e:
            return Response({"error": str(e)},
                            status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        if not check_user_permission(
                request, 'moderator') and not check_user_permission(
                    request, 'admin') and not check_user_permission(
                        request, 'regular'):
            return Response(
                status=status.HTTP_401_UNAUTHORIZED,
                data={"auth": "You are not authorized to perform this action"})

        request.data['user_id'] = get_user_id(request)
        serialized_blends = BlendSerializer(data=request.data)
        if serialized_blends.is_valid():
            serialized_blends.save()
            return Response(serialized_blends.data)
        return Response(serialized_blends.errors,
                        status=status.HTTP_400_BAD_REQUEST)
