from rest_framework.views import APIView

from blends_api.models import Blend

from blends_api.serializer import BlendSerializer
from rest_framework.response import Response
from rest_framework import status

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from django.db import connection


class BlendsAutocomplete(APIView):

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