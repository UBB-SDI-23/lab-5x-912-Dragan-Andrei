from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import connection
from locations_api.models import Location
from helpers.check_user_permission import check_user_permission

import os


class ScriptingLocations(APIView):

    def get(self, request):
        try:
            if not check_user_permission(request, 'admin'):
                return Response(
                    {'auth': 'You are not authorized to perform this action'},
                    status=status.HTTP_401_UNAUTHORIZED)

            # run the SQL script
            os.system(
                'docker cp dbScripts/populateLocations.sql cafe_db_1:/dbScripts/populateLocations.sql'
            )
            os.system(
                'docker exec cafe_db_1 psql -U postgres -d cafe -f dbScripts/populateLocations.sql'
            )

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

            # run the SQL script
            os.system(
                'docker cp dbScripts/deleteLocations.sql cafe_db_1:/dbScripts/deleteLocations.sql'
            )
            os.system(
                'docker exec cafe_db_1 psql -U postgres -d cafe -f dbScripts/deleteLocations.sql'
            )

            return Response(status=status.HTTP_200_OK)
        except:
            return Response(
                {'error': 'There was an error deleting the locations'},
                status=status.HTTP_400_BAD_REQUEST)