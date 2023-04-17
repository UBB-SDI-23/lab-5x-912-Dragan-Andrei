from rest_framework.views import APIView
from locations_api.models import Location
from locations_api.serializer import LocationSerializer
from rest_framework.response import Response
from rest_framework import status
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

from sales_api.models import Sale
from sales_api.serializer import SaleSerializer
from sales_api.sales_pagination import SalePagination


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

            # # get the paginated referenced sales
            sales = Sale.objects.filter(location_id=pk).order_by('-id')
            paginator = SalePagination()
            paginated_sales = paginator.paginate_queryset(sales, request)
            serialized_sales = SaleSerializer(paginated_sales, many=True)

            # get the attributes of the location object
            serialized_location_data = serialized_location.data

            # add the array of sales to the JSON's location object, by removing the "location_id"
            for sale in serialized_sales.data:
                sale['revenue'] = round(sale['revenue'], 2)
                del sale['location_id']
            serialized_location_data[
                'sales'] = paginator.get_paginated_response(
                    serialized_sales.data).data

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
