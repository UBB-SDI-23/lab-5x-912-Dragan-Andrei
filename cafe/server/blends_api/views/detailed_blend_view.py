from rest_framework.views import APIView

from blends_api.models import Blend

from blends_api.serializer import BlendSerializer
from rest_framework.response import Response
from rest_framework import status
from coffees_api.serializer import CoffeeWithoutBlendIDSerializer

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

from helpers.check_user_permission import check_user_permission, get_username


class BlendDetail(APIView):

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

    def put(self, request, pk):
        if not check_user_permission(
                request, 'admin') and not check_user_permission(
                    request, 'moderator') and not check_user_permission(
                        request, 'regular'):
            return Response(
                status=status.HTTP_401_UNAUTHORIZED,
                data={"auth": "You are not authorized to perform this action"})

        try:
            blend = Blend.objects.get(pk=pk)

            if not check_user_permission(
                    request, 'admin') and not check_user_permission(
                        request, 'moderator'
                    ) and blend.user_id.username != get_username(request):
                return Response(
                    status=status.HTTP_401_UNAUTHORIZED,
                    data={
                        "auth": "You are not authorized to perform this action"
                    })

            serialized_blend = BlendSerializer(blend, data=request.data)

            if serialized_blend.is_valid():
                serialized_blend.save()
                return Response(serialized_blend.data)
            return Response(serialized_blend.errors,
                            status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({'error': 'Blend does not exist'},
                            status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        if not check_user_permission(
                request, 'admin') and not check_user_permission(
                    request, 'moderator') and not check_user_permission(
                        request, 'regular'):
            return Response(
                status=status.HTTP_401_UNAUTHORIZED,
                data={"auth": "You are not authorized to perform this action"})
        try:
            blend = Blend.objects.get(pk=pk)

            if not check_user_permission(
                    request, 'admin') and not check_user_permission(
                        request, 'moderator'
                    ) and blend.user_id.username != get_username(request):
                return Response(
                    status=status.HTTP_401_UNAUTHORIZED,
                    data={
                        "auth": "You are not authorized to perform this action"
                    })

            blend.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except:
            return Response({'error': 'Blend does not exist'},
                            status=status.HTTP_400_BAD_REQUEST)