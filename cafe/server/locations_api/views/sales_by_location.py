from django.db.models import Avg
from rest_framework.views import APIView
from rest_framework import status

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

from locations_api.models import Location
from locations_api.location_pagination import LocationPagination
from locations_api.serializer import LocationSerializer

from sales_api.models import Sale


class SalesByLocation(APIView):

    @swagger_auto_schema(
        operation_description=
        "Get a list of locations and the average number of coffees sold per sale",
        responses={
            status.HTTP_200_OK:
            openapi.Response(
                description=
                "List of locations and the average number of coffees sold per sale",
                schema=openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            'location name':
                            openapi.Schema(type=openapi.TYPE_STRING),
                            'sold coffees per sale':
                            openapi.Schema(type=openapi.TYPE_NUMBER)
                        }))),
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

        # find the average number of coffees sold per sale for each location
        answer = []
        for location in serialized_locations.data:
            total_coffees_sold = 0
            number_of_sales = 0
            sales = Sale.objects.filter(location_id=location['id'])
            for sale in sales:
                total_coffees_sold += sale.sold_coffees
                number_of_sales += 1

            if number_of_sales == 0:
                avg_sell = 0
            else:
                avg_sell = total_coffees_sold / number_of_sales
                avg_sell = round(avg_sell, 2)

            answer.append({'name': location['name'], 'avg_sell': avg_sell})

        return paginator.get_paginated_response(answer)
