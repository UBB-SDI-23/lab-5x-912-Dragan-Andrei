from rest_framework.views import APIView

from blends_api.models import Blend
from coffees_api.models import Coffee

from blends_api.serializer import BlendSerializer
from rest_framework.response import Response
from rest_framework import status
from coffees_api.serializer import CoffeeWithoutBlendIDSerializer, CoffeeSerializer

class Blends(APIView):
    def get(self, request):
        blends = Blend.objects.all()
        serialized_blends = BlendSerializer(blends, many=True)
        return Response(serialized_blends.data)

    def post(self, request):
        serialized_blends = BlendSerializer(data=request.data)
        if serialized_blends.is_valid():
            serialized_blends.save()
            return Response(serialized_blends.data)
        return Response(serialized_blends.errors, status=status.HTTP_400_BAD_REQUEST)

class BlendDetail(APIView):
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