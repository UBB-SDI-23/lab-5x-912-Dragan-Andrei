from rest_framework.views import APIView

from blends_api.models import Blend
from coffees_api.models import Coffee

from blends_api.serializer import BlendSerializer
from rest_framework.response import Response
from rest_framework import status
from coffees_api.serializer import CoffeeWithoutBlendIDSerializer, CoffeeSerializer

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

class Blends(APIView):
    @swagger_auto_schema(
        operation_description="Get a list of all blends",
        responses={
            status.HTTP_200_OK: openapi.Response(
                description="List of all blends",
                schema=BlendSerializer(many=True)
            ),
            status.HTTP_400_BAD_REQUEST: openapi.Response(
                description="Error message",
                schema=openapi.Schema(type=openapi.TYPE_OBJECT, properties={
                    'error': openapi.Schema(type=openapi.TYPE_STRING)
                })
            )
        }
    )
    def get(self, request):
        blends = Blend.objects.all()
        serialized_blends = BlendSerializer(blends, many=True)
        return Response(serialized_blends.data)

    @swagger_auto_schema(
        operation_description="Create a new blend",
        request_body=BlendSerializer,
        responses={
            status.HTTP_200_OK: openapi.Response(
                description="Created blend",
                schema=BlendSerializer()
            ),
            status.HTTP_400_BAD_REQUEST: openapi.Response(
                description="Error message",
                schema=openapi.Schema(type=openapi.TYPE_OBJECT, properties={
                    'error': openapi.Schema(type=openapi.TYPE_STRING)
                })
            )
        }
    )
    def post(self, request):
        serialized_blends = BlendSerializer(data=request.data)
        if serialized_blends.is_valid():
            serialized_blends.save()
            return Response(serialized_blends.data)
        return Response(serialized_blends.errors, status=status.HTTP_400_BAD_REQUEST)

class BlendDetail(APIView):
    @swagger_auto_schema(
        operation_description="Get a blend by id",
        responses={
            status.HTTP_200_OK: openapi.Response(
                description="Blend",
                schema=BlendSerializer()
            ),
            status.HTTP_400_BAD_REQUEST: openapi.Response(
                description="Error message",
                schema=openapi.Schema(type=openapi.TYPE_OBJECT, properties={
                    'error': openapi.Schema(type=openapi.TYPE_STRING)
                })
            )
        }
    )
    def get(self, request, pk):
        try:
            blend = Blend.objects.get(pk=pk)
            serialized_blend = BlendSerializer(blend)
            serialized_coffees = CoffeeWithoutBlendIDSerializer(blend.coffees.all(), many=True)

            serialized_blend_data = serialized_blend.data
            serialized_blend_data['coffees'] = serialized_coffees.data

            return Response(serialized_blend_data)  
        except:
            return Response({
                'error': 'Blend does not exist'
            },
            status=status.HTTP_400_BAD_REQUEST)
    
    @swagger_auto_schema(
        operation_description="Update a blend by id",
        request_body=BlendSerializer,
        responses={
            status.HTTP_200_OK: openapi.Response(
                description="Updated blend",
                schema=BlendSerializer()
            ),
            status.HTTP_400_BAD_REQUEST: openapi.Response(
                description="Error message",
                schema=openapi.Schema(type=openapi.TYPE_OBJECT, properties={
                    'error': openapi.Schema(type=openapi.TYPE_STRING)
                })
            )
        }
    )
    def put(self, request, pk):
        try:
            blend = Blend.objects.get(pk=pk)
            serialized_blend = BlendSerializer(blend, data=request.data)
            if serialized_blend.is_valid():
                serialized_blend.save()
                return Response(serialized_blend.data)
            return Response(serialized_blend.errors, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({
                'error': 'Blend does not exist'
            },
            status=status.HTTP_400_BAD_REQUEST)
    
    @swagger_auto_schema(
        operation_description="Delete a blend by id",
        responses={
            status.HTTP_204_NO_CONTENT: openapi.Response(
                description="Blend deleted"
            ),
            status.HTTP_400_BAD_REQUEST: openapi.Response(
                description="Error message",
                schema=openapi.Schema(type=openapi.TYPE_OBJECT, properties={
                    'error': openapi.Schema(type=openapi.TYPE_STRING)
                })
            )
        }
    )
    def delete(self, request, pk):
        try:
            blend = Blend.objects.get(pk=pk)
            blend.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except:
            return Response({
                'error': 'Blend does not exist'
            },
            status=status.HTTP_400_BAD_REQUEST)