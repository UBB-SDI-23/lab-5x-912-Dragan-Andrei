from rest_framework.views import APIView
from locations_api.models import Location
from locations_api.serializer import LocationSerializer
from rest_framework.response import Response
from rest_framework import status
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

from locations_api.location_pagination import LocationPagination


class Locations(APIView):

    @swagger_auto_schema(
        operation_description="Get a list of all locations",
        responses={
            status.HTTP_200_OK:
            openapi.Response(description="List of all locations",
                             schema=LocationSerializer(many=True)),
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
        paginator = LocationPagination()
        locations = Location.objects.all()
        paginated_locations = paginator.paginate_queryset(locations, request)

        serialized_locations = LocationSerializer(paginated_locations,
                                                  many=True)
        return Response({
            'count': locations.count(),
            'results': serialized_locations.data
        })

    @swagger_auto_schema(
        operation_description="Create a new location",
        request_body=LocationSerializer,
        responses={
            status.HTTP_200_OK:
            openapi.Response(description="Created location",
                             schema=LocationSerializer()),
            status.HTTP_400_BAD_REQUEST:
            openapi.Response(description="Error message",
                             schema=openapi.Schema(
                                 type=openapi.TYPE_OBJECT,
                                 properties={
                                     'error':
                                     openapi.Schema(type=openapi.TYPE_STRING)
                                 }))
        })
    def post(self, request):
        serialized_locations = LocationSerializer(data=request.data)
        if serialized_locations.is_valid():
            serialized_locations.save()
            return Response(serialized_locations.data)
        return Response(serialized_locations.errors,
                        status=status.HTTP_400_BAD_REQUEST)
