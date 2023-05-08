from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

from settings_api.models import GlobalConfig
from settings_api.serializer import GlobalConfigSerializer

from helpers.check_user_permission import check_user_permission, get_user_id
from django.contrib.auth import get_user_model

User = get_user_model()


class SetPagination(APIView):

    def get(self, request):
        config = GlobalConfig.objects.get(pk=1)
        serialized_config = GlobalConfigSerializer(config)
        return Response(serialized_config.data)

    def put(self, request):
        if not check_user_permission(request, 'admin'):
            return Response(
                status=status.HTTP_401_UNAUTHORIZED,
                data={"auth": "You are not authorized to perform this action"})

        config = GlobalConfig.objects.get(pk=1)
        serialized_config = GlobalConfigSerializer(config, data=request.data)
        if serialized_config.is_valid():
            serialized_config.save()
            return Response(serialized_config.data)
        return Response(serialized_config.errors,
                        status=status.HTTP_400_BAD_REQUEST)
