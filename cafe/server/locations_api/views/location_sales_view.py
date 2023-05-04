from rest_framework.views import APIView
from locations_api.models import Location
from rest_framework.response import Response
from rest_framework import status
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

from sales_api.models import Sale
from sales_api.serializer import SaleSerializer

from helpers.check_user_permission import check_user_permission, get_user_id


class LocationCoffee(APIView):

    def post(self, request, pk):
        # only admin and moderator can create a new sale
        if not check_user_permission(
                request, 'moderator') and not check_user_permission(
                    request, 'admin'):
            return Response(
                status=status.HTTP_401_UNAUTHORIZED,
                data={"auth": "You are not authorized to perform this action"})

        location = Location.objects.filter(pk=pk).first()
        if not location:
            return Response({"error": f"Location with id {pk} not found"},
                            status=status.HTTP_404_NOT_FOUND)

        for coffee in request.data:
            coffee['location_id'] = pk
            coffee['user_id'] = get_user_id(request)
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
