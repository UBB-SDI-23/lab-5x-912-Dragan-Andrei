from django.db.models import Avg
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

from sales_api.models import Sale
from locations_api.models import Location

class SalesByLocation(APIView):
    @swagger_auto_schema(
        operation_description="Get a list of locations and the average number of coffees sold per sale",
        responses={
            status.HTTP_200_OK: openapi.Response(
                description="List of locations and the average number of coffees sold per sale",
                schema=openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_OBJECT, properties={
                    'location name': openapi.Schema(type=openapi.TYPE_STRING),
                    'sold coffees per sale': openapi.Schema(type=openapi.TYPE_NUMBER)
                }))
            ),
            status.HTTP_400_BAD_REQUEST: openapi.Response(
                description="Error message",
                schema=openapi.Schema(type=openapi.TYPE_OBJECT, properties={
                    'error': openapi.Schema(type=openapi.TYPE_STRING)
                })
            )
        }
    )
    def get(self, request):
        # order the locations by their number of sold coffees sold per sale
        sales_data = Sale.objects.values('location_id').annotate(avg_sold_coffees=Avg('sold_coffees')).order_by('-avg_sold_coffees')

        result = []
        for data in sales_data:
            location = Location.objects.get(pk=data['location_id'])
            result.append({
                'location name': location.name,
                'sold coffees per sale': data['avg_sold_coffees']
            })

        return Response(result)
