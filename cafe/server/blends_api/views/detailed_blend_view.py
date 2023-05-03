from rest_framework.views import APIView

from blends_api.models import Blend

from blends_api.serializer import BlendSerializer
from rest_framework.response import Response
from rest_framework import status
from coffees_api.serializer import CoffeeWithoutBlendIDSerializer

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

from helpers.check_user_permission import check_user_permission


class BlendDetail(APIView):

    @swagger_auto_schema(
        operation_description="Get a blend by id",
        responses={
            status.HTTP_200_OK:
            openapi.Response(
                description="Blend",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'id':
                        openapi.Schema(type=openapi.TYPE_INTEGER),
                        'name':
                        openapi.Schema(type=openapi.TYPE_STRING),
                        'description':
                        openapi.Schema(type=openapi.TYPE_STRING),
                        'level':
                        openapi.Schema(type=openapi.TYPE_INTEGER),
                        'in_stock':
                        openapi.Schema(type=openapi.TYPE_BOOLEAN),
                        'coffees':
                        openapi.Schema(
                            type=openapi.TYPE_ARRAY,
                            items=openapi.Schema(
                                type=openapi.TYPE_OBJECT,
                                properties={
                                    'id':
                                    openapi.Schema(type=openapi.TYPE_INTEGER),
                                    'name':
                                    openapi.Schema(type=openapi.TYPE_STRING),
                                    'price':
                                    openapi.Schema(type=openapi.TYPE_NUMBER),
                                    'calories':
                                    openapi.Schema(type=openapi.TYPE_INTEGER),
                                    'quantity':
                                    openapi.Schema(type=openapi.TYPE_NUMBER),
                                    'vegan':
                                    openapi.Schema(type=openapi.TYPE_BOOLEAN),
                                }))
                    })),
            status.HTTP_400_BAD_REQUEST:
            openapi.Response(description="Error message",
                             schema=openapi.Schema(
                                 type=openapi.TYPE_OBJECT,
                                 properties={
                                     'error':
                                     openapi.Schema(type=openapi.TYPE_STRING)
                                 }))
        })
    def get(self, request, pk):
        try:
            blend = Blend.objects.get(pk=pk)
            serialized_blend = BlendSerializer(blend)
            serialized_coffees = CoffeeWithoutBlendIDSerializer(
                blend.coffees.all(), many=True)

            serialized_blend_data = serialized_blend.data
            serialized_blend_data['coffees'] = serialized_coffees.data

            return Response(serialized_blend_data)
        except:
            return Response({'error': 'Blend does not exist'},
                            status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        operation_description="Update a blend by id",
        request_body=BlendSerializer,
        responses={
            status.HTTP_200_OK:
            openapi.Response(description="Updated blend",
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
    def put(self, request, pk):
        # only admin and moderator can update a blend
        if not check_user_permission(request,
                                     'admin') and not check_user_permission(
                                         request, 'moderator'):
            return Response(
                status=status.HTTP_401_UNAUTHORIZED,
                data={"auth": "You are not authorized to perform this action"})

        try:
            blend = Blend.objects.get(pk=pk)
            serialized_blend = BlendSerializer(blend, data=request.data)
            if serialized_blend.is_valid():
                serialized_blend.save()
                return Response(serialized_blend.data)
            return Response(serialized_blend.errors,
                            status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({'error': 'Blend does not exist'},
                            status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        operation_description="Delete a blend by id",
        responses={
            status.HTTP_204_NO_CONTENT:
            openapi.Response(description="Blend deleted"),
            status.HTTP_400_BAD_REQUEST:
            openapi.Response(description="Error message",
                             schema=openapi.Schema(
                                 type=openapi.TYPE_OBJECT,
                                 properties={
                                     'error':
                                     openapi.Schema(type=openapi.TYPE_STRING)
                                 }))
        })
    def delete(self, request, pk):
        # only admin can delete a blend
        if not check_user_permission(request, 'admin'):
            return Response(
                status=status.HTTP_401_UNAUTHORIZED,
                data={"auth": "You are not authorized to perform this action"})
        try:
            blend = Blend.objects.get(pk=pk)
            blend.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except:
            return Response({'error': 'Blend does not exist'},
                            status=status.HTTP_400_BAD_REQUEST)