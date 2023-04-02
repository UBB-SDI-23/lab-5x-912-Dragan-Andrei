from rest_framework.views import APIView
from locations_api.models import Location
from locations_api.serializer import LocationSerializer
from rest_framework.response import Response
from rest_framework import status
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

from sales_api.models import Sale
from sales_api.serializer import SaleSerializer


class Locations(APIView):

    @swagger_auto_schema(
        operation_description="Get a list of all locations",
        responses={
            status.HTTP_200_OK:
            openapi.Response(description="List of all locations",
                             schema=LocationSerializer(many=True)),
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
        locations = Location.objects.all()
        serialized_locations = LocationSerializer(locations, many=True)
        return Response(serialized_locations.data)

    @swagger_auto_schema(
        operation_description="Create a new location",
        request_body=LocationSerializer,
        responses={
            status.HTTP_200_OK:
            openapi.Response(description="Created location",
                             schema=LocationSerializer()),
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
        serialized_locations = LocationSerializer(data=request.data)
        if serialized_locations.is_valid():
            serialized_locations.save()
            return Response(serialized_locations.data)
        return Response(serialized_locations.errors,
                        status=status.HTTP_400_BAD_REQUEST)


class LocationDetail(APIView):

    @swagger_auto_schema(
        operation_description="Get a location by id",
        responses={
            status.HTTP_200_OK:
            openapi.Response(
                description="Location",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'id':
                        openapi.Schema(type=openapi.TYPE_INTEGER),
                        'name':
                        openapi.Schema(type=openapi.TYPE_STRING),
                        'address':
                        openapi.Schema(type=openapi.TYPE_STRING),
                        'city':
                        openapi.Schema(type=openapi.TYPE_STRING),
                        'postal_code':
                        openapi.Schema(type=openapi.TYPE_STRING),
                        'profit':
                        openapi.Schema(type=openapi.TYPE_NUMBER),
                        'sales':
                        openapi.Schema(
                            type=openapi.TYPE_ARRAY,
                            items=openapi.Schema(
                                type=openapi.TYPE_OBJECT,
                                properties={
                                    'id':
                                    openapi.Schema(type=openapi.TYPE_INTEGER),
                                    'coffee_id':
                                    openapi.Schema(type=openapi.TYPE_INTEGER),
                                    'revenue':
                                    openapi.Schema(type=openapi.TYPE_NUMBER),
                                    'sold_coffees':
                                    openapi.Schema(type=openapi.TYPE_INTEGER)
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
            location = Location.objects.get(pk=pk)
            serialized_location = LocationSerializer(location)

            # get the referenced entries inside the many-to-many relation between locations and coffees
            sales = Sale.objects.filter(location_id=pk)
            serialized_sales = SaleSerializer(sales, many=True)

            # get the attributes of the location object
            serialized_location_data = serialized_location.data

            # add the array of sales to the JSON's location object, by removing the "location_id"
            for sale in serialized_sales.data:
                sale['revenue'] = round(sale['revenue'], 2)
                del sale['location_id']
            serialized_location_data['sales'] = serialized_sales.data

            return Response(serialized_location_data)
        except:
            return Response({'error': 'Location does not exist'},
                            status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        operation_description="Update a location by id",
        request_body=LocationSerializer,
        responses={
            status.HTTP_200_OK:
            openapi.Response(description="Updated location",
                             schema=LocationSerializer()),
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
        try:
            location = Location.objects.get(pk=pk)
            serialized_location = LocationSerializer(location,
                                                     data=request.data)
            if serialized_location.is_valid():
                serialized_location.save()
                return Response(serialized_location.data)
            return Response(serialized_location.errors,
                            status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({'error': 'Location does not exist'},
                            status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        operation_description="Delete a location by id",
        responses={
            status.HTTP_200_OK:
            openapi.Response(description="Deleted location",
                             schema=LocationSerializer()),
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
        try:
            location = Location.objects.get(pk=pk)
            location.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except:
            return Response({'error': 'Location does not exist'},
                            status=status.HTTP_400_BAD_REQUEST)


class LocationCoffee(APIView):

    @swagger_auto_schema(
        operation_description="Add a new sale to a location",
        responses={
            status.HTTP_200_OK:
            openapi.Response(
                description="Sales for a certain location and coffee",
                schema=SaleSerializer(many=True)),
            status.HTTP_400_BAD_REQUEST:
            openapi.Response(description="Error message",
                             schema=openapi.Schema(
                                 type=openapi.TYPE_OBJECT,
                                 properties={
                                     'error':
                                     openapi.Schema(type=openapi.TYPE_STRING)
                                 }))
        })
    def post(self, request, pk):
        location = Location.objects.filter(pk=pk).first()
        if not location:
            return Response({"error": f"Location with id {id} not found"},
                            status=status.HTTP_404_NOT_FOUND)

        for coffee in request.data:
            coffee['location_id'] = pk
            serialized_sale = SaleSerializer(data=coffee)
            if serialized_sale.is_valid():
                sale_data = serialized_sale.validated_data
                sale = Sale.objects.create(**sale_data)
                sale.save()

        return Response(status=status.HTTP_201_CREATED)
