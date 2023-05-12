from rest_framework.views import APIView

from rest_framework.response import Response
from rest_framework import status
from django.db import connection
from coffees_api.models import Coffee

from helpers.check_user_permission import check_user_permission
import os


class ScriptingCoffees(APIView):

    def get(self, request):
        try:
            if not check_user_permission(request, 'admin'):
                return Response(
                    {'auth': 'You are not authorized to perform this action'},
                    status=status.HTTP_401_UNAUTHORIZED)

            # run the SQL script
            os.system(
                'docker cp dbScripts/populateCoffees.sql cafe_db_1:/populateCoffees.sql'
            )
            os.system(
                'docker exec cafe_db_1 psql -U postgres -d cafe -f populateCoffees.sql'
            )

            return Response(status=status.HTTP_200_OK)
        except:
            return Response(
                {'error': 'There was an error creating the coffees'},
                status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        try:
            if not check_user_permission(request, 'admin'):
                return Response(
                    {'error': 'You are not authorized to perform this action'},
                    status=status.HTTP_401_UNAUTHORIZED)

            # run the SQL script
            os.system(
                'docker cp dbScripts/deleteCoffees.sql cafe_db_1:/deleteCoffees.sql'
            )
            os.system(
                'docker exec cafe_db_1 psql -U postgres -d cafe -f deleteCoffees.sql'
            )

            return Response(status=status.HTTP_200_OK)
        except:
            return Response(
                {'error': 'There was an error deleting the coffees'},
                status=status.HTTP_400_BAD_REQUEST)