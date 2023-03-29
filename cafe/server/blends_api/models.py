from django.db import models
from django.core.exceptions import ValidationError

def validate_blend_level(value):
    if value < 1 or value > 5:
        raise ValidationError('strength level should be between 1 and 5', params={'value': value})

# Create your models here.
class Blend(models.Model):
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=1000)
    country_of_origin = models.CharField(max_length=50)
    level = models.IntegerField(validators=[validate_blend_level])
    in_stock = models.BooleanField()