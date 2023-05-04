from rest_framework.views import APIView

from sales_api.models import Sale
from sales_api.serializer import SaleSerializer
from sales_api.sales_pagination import SalePagination

from coffees_api.models import Coffee

from rest_framework import status
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

from django.contrib.auth import get_user_model

User = get_user_model()


class Sales(APIView):

    @swagger_auto_schema(
        operation_description="Get a list of all sales for a selected location",
        responses={
            status.HTTP_200_OK:
            openapi.Response(
                description="List of all sales for a selected location",
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
    def get(self, request):
        # get the location id from the query params
        location_id = request.query_params.get('location_id', None)

        # get the sales for the selected location
        sales = Sale.objects.filter(location_id=location_id).order_by('-id')
        paginator = SalePagination()
        paginated_sales = paginator.paginate_queryset(sales, request)
        serialized_sales = SaleSerializer(paginated_sales, many=True)

        # compute the total of sold coffees no matter the location
        # also get the user's username
        for sale in serialized_sales.data:
            sale['coffees_sold_worldwide'] = 0
            worldwide_sales = Sale.objects.filter(coffee_id=sale['coffee_id'])
            for worldwide_sale in worldwide_sales:
                sale['coffees_sold_worldwide'] += worldwide_sale.sold_coffees

            # add the name of the coffee as well
            sale['coffee_name'] = Coffee.objects.get(id=sale['coffee_id']).name

            # round the revenue
            sale['revenue'] = round(sale['revenue'], 2)

            # get the username
            sale['username'] = User.objects.get(id=sale['user_id']).username

        return paginator.get_paginated_response(serialized_sales.data)
