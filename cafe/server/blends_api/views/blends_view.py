from rest_framework.views import APIView

from blends_api.models import Blend

from blends_api.serializer import BlendSerializer
from rest_framework.response import Response
from rest_framework import status

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema


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
        blends = Blend.objects.all()
        serialized_blends = BlendSerializer(blends, many=True)
        return Response(serialized_blends.data)

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
        serialized_blends = BlendSerializer(data=request.data)
        if serialized_blends.is_valid():
            serialized_blends.save()
            return Response(serialized_blends.data)
        return Response(serialized_blends.errors,
                        status=status.HTTP_400_BAD_REQUEST)
