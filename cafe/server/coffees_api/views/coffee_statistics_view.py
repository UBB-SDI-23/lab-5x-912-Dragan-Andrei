from rest_framework.views import APIView
from coffees_api.models import Coffee
from coffees_api.serializer import CoffeeSerializer
from rest_framework.response import Response
from rest_framework import status
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

from blends_api.models import Blend


class OtherCoffeesByBlends(APIView):

    @swagger_auto_schema(
        operation_description=
        "Get all coffees sorted by the number of other coffees that contain the same blend",
        responses={
            status.HTTP_200_OK:
            openapi.Response(
                description="Coffees",
                schema=openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            'name':
                            openapi.Schema(type=openapi.TYPE_STRING),
                            'coffees with similar blend':
                            openapi.Schema(type=openapi.TYPE_INTEGER)
                        })))
        })
    def get(self, request):
        # show all coffees sorted by the number of other coffees that contain the same blend
        coffees_with_similar_blend = {}

        for blend in Blend.objects.all():
            coffees_data = Coffee.objects.filter(blend_id=blend)
            for coffee in coffees_data:
                serialized_coffee = CoffeeSerializer(coffee)
                coffees_with_similar_blend[
                    serialized_coffee.data['id']] = len(coffees_data) - 1

        answer = []
        for coffee in Coffee.objects.all():
            serialized_coffee = CoffeeSerializer(coffee)

            if coffees_with_similar_blend[serialized_coffee.data['id']]:
                answer.append({
                    'name':
                    serialized_coffee.data['name'],
                    'coffees with similar blend':
                    coffees_with_similar_blend[serialized_coffee.data['id']]
                })
            else:
                answer.append({
                    'name': serialized_coffee.data['name'],
                    'coffees with similar blend': 0
                })

        answer.sort(key=lambda x: x['coffees with similar blend'],
                    reverse=True)
        return Response(answer)