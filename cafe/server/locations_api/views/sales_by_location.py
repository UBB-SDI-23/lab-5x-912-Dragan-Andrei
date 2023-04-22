from django.db.models import Avg
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

from sales_api.models import Sale
from locations_api.models import Location
from locations_api.location_pagination import LocationPagination


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
        locations = Location.objects.all().order_by('-id')
        paginator = LocationPagination()
        paginated_locations = paginator.paginate_queryset(locations, request)

        answer = []
        for location in paginated_locations:
            avg_sell = location.sale_set.aggregate(
                avg_sell=Avg('sold_coffees'))['avg_sell']
            answer.append({'name': location.name, 'avg_sell': avg_sell})

        return Response({
            'count': paginated_locations.paginator.count,
            'current_page': paginated_locations.number,
            'results': answer,
        })
