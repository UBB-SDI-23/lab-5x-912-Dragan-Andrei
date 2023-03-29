from rest_framework import serializers
from coffees_api.models import Blend

class BlendSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blend
        fields = "__all__"