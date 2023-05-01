from rest_framework.views import APIView
from locations_api.models import Location
from rest_framework.response import Response
from rest_framework import status
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

from sales_api.models import Sale
from sales_api.serializer import SaleSerializer


class LocationCoffee(APIView):

    @swagger_auto_schema(
        operation_description="Add a new sale to a selected location",
        responses={
            status.HTTP_200_OK:
            openapi.Response(
                description="Added coffee sale to selected location",
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
            return Response({"error": f"Location with id {pk} not found"},
                            status=status.HTTP_404_NOT_FOUND)

        for coffee in request.data:
            coffee['location_id'] = pk
            serialized_sale = SaleSerializer(data=coffee)
            if serialized_sale.is_valid():
                try:
                    sale_data = serialized_sale.validated_data
                    sale = Sale.objects.create(**sale_data)
                    sale.save()
                except:
                    return Response({"error": f"Sale already exists"},
                                    status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({"error": f"Invalid data"},
                                status=status.HTTP_400_BAD_REQUEST)

        return Response(status=status.HTTP_201_CREATED)
