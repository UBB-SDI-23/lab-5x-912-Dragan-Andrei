from rest_framework.views import APIView
from coffees_api.models import Coffee
from coffees_api.serializer import CoffeeSerializer
from rest_framework.response import Response
from rest_framework import status
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

from coffees_api.coffee_pagination import CoffeePagination


class Coffees(APIView):
    pagination_class = CoffeePagination

    @swagger_auto_schema(
        operation_description="Get a list of all coffees",
        manual_parameters=[
            openapi.Parameter(
                'min_price',
                openapi.IN_QUERY,
                'Get a list of all coffees with price greater than min_price',
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
        filtered_coffees = Coffee.objects.all().order_by('-id')
        coffee_top_price = self.request.query_params.get('min_price')
        if coffee_top_price is not None:
            filtered_coffees = filtered_coffees.filter(
                price__gt=coffee_top_price)

        if self.request.query_params.get('sort'):
            filtered_coffees = filtered_coffees.order_by('price')

        paginator = CoffeePagination()
        paginated_coffees = paginator.paginate_queryset(
            filtered_coffees, request)
        serialized_coffees = CoffeeSerializer(paginated_coffees, many=True)

        return paginator.get_paginated_response(serialized_coffees.data)

    @swagger_auto_schema(
        operation_description="Create a new coffee",
        request_body=CoffeeSerializer,
        responses={
            status.HTTP_200_OK:
            openapi.Response(description="Created coffee",
                             schema=CoffeeSerializer()),
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
        serialized_coffee = CoffeeSerializer(data=request.data)
        if serialized_coffee.is_valid():
            serialized_coffee.save()
            return Response(serialized_coffee.data)
        return Response(serialized_coffee.errors,
                        status=status.HTTP_400_BAD_REQUEST)