from rest_framework.views import APIView

from blends_api.serializer import BlendSerializer
from rest_framework import status

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

from django.db import connection

from blends_api.blend_pagination import BlendPagination


class BlendsCountry(APIView):

    @swagger_auto_schema(
        operation_description=
        "Get a list of all countries sorted descending by the associated number of blends",
        responses={
            status.HTTP_200_OK:
            openapi.Response(
                description=
                "List of all countries sorted descending by the associated number of blends",
                schema=BlendSerializer(many=True)),
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
        # get statistic data
        cursor = connection.cursor()
        sql_query = "SELECT country_of_origin, COUNT(*) as count FROM blends_api_blend GROUP BY country_of_origin ORDER BY COUNT(*) DESC"
        cursor.execute(sql_query)
        rows = cursor.fetchall()
        answer = [
            dict(zip(['country_of_origin', 'count'], row)) for row in rows
        ]

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

        # get the countries
        paginator = BlendPagination()
        paginated_countries = paginator.paginate_queryset(answer, request)
        return paginator.get_paginated_response(paginated_countries)
