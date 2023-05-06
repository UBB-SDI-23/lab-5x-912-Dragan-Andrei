from rest_framework.views import APIView

from rest_framework.response import Response
from rest_framework import status

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

from coffees_api.models import Coffee
from coffees_api.serializer import CoffeeSerializer
from coffees_api.coffee_pagination import CoffeePagination

from helpers.check_user_permission import check_user_permission, get_user_id
from django.contrib.auth import get_user_model

User = get_user_model()


class Coffees(APIView):

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

        # get the coffees
        filtered_coffees = Coffee.objects.all().order_by('-id')
        coffee_top_price = self.request.query_params.get('min_price')
        if coffee_top_price is not None:
            filtered_coffees = filtered_coffees.filter(
                price__gt=coffee_top_price)

        if self.request.query_params.get('sort'):
            filtered_coffees = filtered_coffees.order_by('price')

        paginator = CoffeePagination()
        paginated_coffees = paginator.paginate_queryset(
            filtered_coffees, request)
        serialized_coffees = CoffeeSerializer(paginated_coffees, many=True)

        # check by how many coffees the blend is used
        # also get the user's username
        for coffee in serialized_coffees.data:
            coffee['blend_count'] = Coffee.objects.filter(
                blend_id=coffee['id']).count()
            coffee['username'] = User.objects.get(
                id=coffee['user_id']).username

        return paginator.get_paginated_response(serialized_coffees.data)

    def post(self, request):
        if not check_user_permission(
                request, 'moderator') and not check_user_permission(
                    request, 'admin') and not check_user_permission(
                        request, 'regular'):
            return Response(
                status=status.HTTP_401_UNAUTHORIZED,
                data={"auth": "You are not authorized to perform this action"})

        request.data['user_id'] = get_user_id(request)
        serialized_coffee = CoffeeSerializer(data=request.data)
        if serialized_coffee.is_valid():
            serialized_coffee.save()
            return Response(serialized_coffee.data)
        else:
            return Response(
                serialized_coffee.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )
