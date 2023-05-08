from rest_framework import serializers
from settings_api.models import GlobalConfig


class GlobalConfigSerializer(serializers.ModelSerializer):

    class Meta:
        model = GlobalConfig
        fields = "__all__"