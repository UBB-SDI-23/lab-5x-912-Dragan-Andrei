from rest_framework.views import APIView

from blends_api.models import Blend

from blends_api.serializer import BlendSerializer
from rest_framework.response import Response
from rest_framework import status

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

from django.contrib.postgres.search import SearchQuery, SearchVector, SearchRank
from django.db import connection


class BlendsAutocomplete(APIView):

    @swagger_auto_schema(
        operation_description=
        "Get a list of the top 10 blends that match the query",
        manual_parameters=[
            openapi.Parameter('query',
                              openapi.IN_QUERY,
                              'Search query',
                              type=openapi.TYPE_STRING),
        ],
        responses={
            status.HTTP_200_OK:
            openapi.Response(description="List of all blends",
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
        query = request.query_params.get('query', None)
        if query:
            # convert the query to lowercase
            query = query.lower()

            # insert here the SQL query
            cursor = connection.cursor()
            fields = [field.column for field in Blend._meta.fields]
            fields_str = ", ".join(fields)
            sql_query = f"SELECT {fields_str} FROM blends_api_blend WHERE LOWER(name) LIKE %s LIMIT 10"
            cursor.execute(sql_query, ['%' + query + '%'])
            rows = cursor.fetchall()
            blends = [Blend(**dict(zip(fields, row))) for row in rows]
        else:
            blends = Blend.objects.all()[:10]

        serialized_blends = BlendSerializer(blends, many=True)
        return Response(serialized_blends.data)