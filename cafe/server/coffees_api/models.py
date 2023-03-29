from django.db import models
from blends_api.models import Blend
from django.core.exceptions import ValidationError

def validate_positive(value):
    if value < 0:
        raise ValidationError('%(value)s is not a positive number', params={'value': value})

# Create your models here.
class Coffee(models.Model): 
    name = models.CharField(max_length=50)
    price = models.FloatField(validators=[validate_positive])
    calories = models.IntegerField(validators=[validate_positive])
    quantity = models.FloatField(validators=[validate_positive])
    vegan = models.BooleanField()
    blend_id = models.ForeignKey(Blend, on_delete=models.CASCADE, default=1, related_name="coffees")

    def __str__(self):
        return self.name