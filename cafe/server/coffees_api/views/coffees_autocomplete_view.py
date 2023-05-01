from rest_framework.views import APIView
from coffees_api.models import Coffee
from coffees_api.serializer import CoffeeSerializer
from rest_framework.response import Response
from rest_framework import status
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema


class CoffeesAutocomplete(APIView):

    @swagger_auto_schema(
        operation_description=
        "Get a list of the top 10 coffees that match the query",
        manual_parameters=[
            openapi.Parameter('query',
                              openapi.IN_QUERY,
                              'Search query',
                              type=openapi.TYPE_STRING),
        ],
        responses={
            status.HTTP_200_OK:
            openapi.Response(description="List of all coffees",
                             schema=CoffeeSerializer(many=True)),
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
        query = request.query_params.get('query', None)
        if query:
            coffees = Coffee.objects.filter(
                name__icontains=query).order_by('name')[:10]
        else:
            coffees = Coffee.objects.all()[:10]

        serialized_coffees = CoffeeSerializer(coffees, many=True)
        return Response(serialized_coffees.data)