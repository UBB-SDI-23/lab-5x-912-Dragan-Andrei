from django.db.models import Avg
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

from sales_api.models import Sale
from locations_api.models import Location

from django.db import connection
from sales_api.sales_pagination import SalePagination


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
        # order the locations by their average number of sold coffees sold per sale
        cursor = connection.cursor()
        sql_query = "SELECT locations.name, AVG(sales.sold_coffees) AS avg_sell FROM locations_api_location locations INNER JOIN sales_api_sale sales ON locations.id = sales.location_id_id GROUP BY locations.name ORDER BY avg_sell DESC"
        cursor.execute(sql_query)
        rows = cursor.fetchall()
        answer = [dict(zip(['name', 'avg_sell'], row)) for row in rows]

        paginator = SalePagination()
        return paginator.get_paginated_response(
            paginator.paginate_queryset(answer, request))