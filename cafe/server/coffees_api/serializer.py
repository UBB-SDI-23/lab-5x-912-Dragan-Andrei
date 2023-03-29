from rest_framework import serializers
from coffees_api.models import Coffee

class CoffeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coffee
        fields = "__all__"

class CoffeeWithoutBlendIDSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coffee
        exclude = ('blend_id',)