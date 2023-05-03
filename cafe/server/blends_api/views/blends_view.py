from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

from blends_api.models import Blend
from blends_api.serializer import BlendSerializer
from blends_api.blend_pagination import BlendPagination

from coffees_api.models import Coffee

from helpers.check_user_permission import check_user_permission


class Blends(APIView):

    @swagger_auto_schema(
        operation_description="Get a list of all blends",
        responses={
            status.HTTP_200_OK:
            openapi.Response(description="List of all blends",
                             schema=BlendSerializer(many=True)),
            status.HTTP_400_BAD_REQUEST:
            openapi.Response(description="Error message",
                             schema=openapi.Schema(
                                 type=openapi.TYPE_OBJECT,
                                 properties={
                                     'error':
                                     openapi.Schema(type=openapi.TYPE_STRING)
                                 }))
        })
    def get(self, request):
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
        for blend in serialized_blends.data:
            blend['used_by'] = Coffee.objects.filter(
                blend_id=blend['id']).count()

        return paginator.get_paginated_response(serialized_blends.data)

    @swagger_auto_schema(
        operation_description="Create a new blend",
        request_body=BlendSerializer,
        responses={
            status.HTTP_200_OK:
            openapi.Response(description="Created blend",
                             schema=BlendSerializer()),
            status.HTTP_400_BAD_REQUEST:
            openapi.Response(description="Error message",
                             schema=openapi.Schema(
                                 type=openapi.TYPE_OBJECT,
                                 properties={
                                     'error':
                                     openapi.Schema(type=openapi.TYPE_STRING)
                                 }))
        })
    def post(self, request):
        # only admin and moderator can create a new blend
        if not check_user_permission(
                request, 'moderator') and not check_user_permission(
                    request, 'admin'):
            return Response(
                status=status.HTTP_401_UNAUTHORIZED,
                data={"auth": "You are not authorized to perform this action"})
        serialized_blends = BlendSerializer(data=request.data)
        if serialized_blends.is_valid():
            serialized_blends.save()
            return Response(serialized_blends.data)
        return Response(serialized_blends.errors,
                        status=status.HTTP_400_BAD_REQUEST)
