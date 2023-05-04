from rest_framework.views import APIView

from locations_api.models import Location
from sales_api.models import Sale

from locations_api.serializer import LocationSerializer
from rest_framework.response import Response
from rest_framework import status
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

from locations_api.location_pagination import LocationPagination

from helpers.check_user_permission import check_user_permission, get_user_id
from django.contrib.auth import get_user_model

User = get_user_model()


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
        # get the page number and page size from the query params
        page = int(request.query_params.get('p', 1))
        page_size = int(request.query_params.get('page_size', 10))

        # calculate the offset and limit
        offset = (page - 1) * page_size
        limit = page_size

        # add the offset and limit to the request object as query params
        request.query_params._mutable = True
        request.query_params['offset'] = offset
        request.query_params['limit'] = limit

        # get the locations
        locations = Location.objects.all().order_by('-id')
        paginator = LocationPagination()
        paginated_locations = paginator.paginate_queryset(locations, request)
        serialized_locations = LocationSerializer(paginated_locations,
                                                  many=True)

        # compute the total revenue for each location
        # also get the user's username
        for location in serialized_locations.data:
            location['total_revenue'] = 0
            sales = Sale.objects.filter(location_id=location['id'])
            for sale in sales:
                location['total_revenue'] += sale.revenue
            location['total_revenue'] = round(location['total_revenue'], 2)

            location['username'] = User.objects.get(
                id=location['user_id']).username

        return paginator.get_paginated_response(serialized_locations.data)

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
        # only admin and moderator can create a new location
        if not check_user_permission(
                request, 'moderator') and not check_user_permission(
                    request, 'admin'):
            return Response(
                status=status.HTTP_401_UNAUTHORIZED,
                data={"auth": "You are not authorized to perform this action"})

        request.data['user_id'] = get_user_id(request)
        serialized_locations = LocationSerializer(data=request.data)
        if serialized_locations.is_valid():
            serialized_locations.save()
            return Response(serialized_locations.data)
        return Response(serialized_locations.errors,
                        status=status.HTTP_400_BAD_REQUEST)
