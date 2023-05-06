from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import connection
from locations_api.models import Location
from helpers.check_user_permission import check_user_permission


class ScriptingLocations(APIView):

    def post(self, request):
        try:
            if not check_user_permission(request, 'admin'):
                return Response(
                    {'auth': 'You are not authorized to perform this action'},
                    status=status.HTTP_401_UNAUTHORIZED)

            # run the SQL script

            with open('../../dbScripts/populateLocations.sql', 'r') as f:
                sql_script = f.read()

            cursor = connection.cursor()
            cursor.execute(sql_script)

            return Response(status=status.HTTP_200_OK)
        except:
            return Response(
                {'error': 'There was an error creating the locations'},
                status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        try:
            if not check_user_permission(request, 'admin'):
                return Response(
                    {'auth': 'You are not authorized to perform this action'},
                    status=status.HTTP_401_UNAUTHORIZED)

            # delete all coffees
            Location.objects.all().delete()

            return Response(status=status.HTTP_200_OK)
        except:
            return Response(
                {'error': 'There was an error deleting the locations'},
                status=status.HTTP_400_BAD_REQUEST)