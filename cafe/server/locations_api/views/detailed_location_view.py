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

from helpers.check_user_permission import check_user_permission


class LocationDetail(APIView):

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

    def put(self, request, pk):
        # only admin and moderator can update a location
        if not check_user_permission(request,
                                     'admin') and not check_user_permission(
                                         request, 'moderator'):
            return Response(
                status=status.HTTP_401_UNAUTHORIZED,
                data={"auth": "You are not authorized to perform this action"})

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

    def delete(self, request, pk):
        # only admin can delete a location
        if not check_user_permission(request, 'admin'):
            return Response(
                status=status.HTTP_401_UNAUTHORIZED,
                data={"auth": "You are not authorized to perform this action"})

        try:
            location = Location.objects.get(pk=pk)
            location.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except:
            return Response({'error': 'Location does not exist'},
                            status=status.HTTP_400_BAD_REQUEST)
