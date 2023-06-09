from rest_framework.views import APIView
from coffees_api.models import Coffee
from coffees_api.serializer import CoffeeSerializer
from rest_framework.response import Response
from rest_framework import status
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

from blends_api.serializer import BlendSerializer
from sales_api.models import Sale
from sales_api.serializer import SaleSerializer

from sales_api.sales_pagination import SalePagination

from helpers.check_user_permission import check_user_permission, get_username


class CoffeeDetail(APIView):

    def get(self, request, pk):
        try:
            coffee = Coffee.objects.get(pk=pk)
            serialized_coffee = CoffeeSerializer(coffee)

            # get the referenced blend (the 1-to-many relation)
            serialized_blend = BlendSerializer(coffee.blend_id)

            # get the paginated referenced sales
            sales = Sale.objects.filter(coffee_id=pk).order_by("-id")
            paginator = SalePagination()
            paginated_sales = paginator.paginate_queryset(sales, request)
            serialized_sales = SaleSerializer(paginated_sales, many=True)

            # get the attributes of the coffee object
            serialized_coffee_data = serialized_coffee.data

            # add the blend to the JSON's coffee object, by also removing the blend_id, since it's already inside the body of the blend itself
            del serialized_coffee_data['blend_id']
            serialized_coffee_data['blend'] = serialized_blend.data

            # add the array of sales to the JSON's coffee object, by removing the "coffee_id"
            for sale in serialized_sales.data:
                sale['revenue'] = round(sale['revenue'], 2)
                del sale['coffee_id']
            serialized_coffee_data['sales'] = paginator.get_paginated_response(
                serialized_sales.data).data

            return Response(serialized_coffee_data)
        except:
            return Response(
                {
                    'error':
                    'The coffee does not exist or there was an error receiving the related information for the coffee'
                },
                status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        if not check_user_permission(
                request, 'admin') and not check_user_permission(
                    request, 'moderator') and not check_user_permission(
                        request, 'regular'):
            return Response(
                status=status.HTTP_401_UNAUTHORIZED,
                data={"auth": "You are not authorized to perform this action"})
        try:
            coffee = Coffee.objects.get(pk=pk)

            if not check_user_permission(
                    request, 'admin') and not check_user_permission(
                        request, 'moderator'
                    ) and coffee.user_id.username != get_username(request):
                return Response(
                    status=status.HTTP_401_UNAUTHORIZED,
                    data={
                        "auth": "You are not authorized to perform this action"
                    })

            serialized_coffee = CoffeeSerializer(coffee, data=request.data)
            if serialized_coffee.is_valid():
                serialized_coffee.save()
                return Response(serialized_coffee.data)
            return Response(serialized_coffee.errors,
                            status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({'error': 'Coffee does not exist'},
                            status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        if not check_user_permission(
                request, 'admin') and not check_user_permission(
                    request, 'moderator') and not check_user_permission(
                        request, 'regular'):
            return Response(
                status=status.HTTP_401_UNAUTHORIZED,
                data={"auth": "You are not authorized to perform this action"})

        try:
            coffee = Coffee.objects.get(pk=pk)

            if not check_user_permission(
                    request, 'admin') and not check_user_permission(
                        request, 'moderator'
                    ) and coffee.user_id.username != get_username(request):
                return Response(
                    status=status.HTTP_401_UNAUTHORIZED,
                    data={
                        "auth": "You are not authorized to perform this action"
                    })

            coffee.delete()
            return Response(status=status.HTTP_200_OK)
        except:
            return Response({'error': 'Coffee does not exist'},
                            status=status.HTTP_400_BAD_REQUEST)