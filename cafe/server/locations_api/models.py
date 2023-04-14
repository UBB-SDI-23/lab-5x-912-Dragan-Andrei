from django.db import models
from django.core.exceptions import ValidationError


def postal_code_length(value):
    if len(value) != 5:
        raise ValidationError(
            'postal code should have a fixed length of 5 digits')


# Create your models here.
class Location(models.Model):
    name = models.CharField(max_length=50)
    address = models.CharField(max_length=1000)
    city = models.CharField(max_length=1000)
    postal_code = models.CharField(max_length=50,
                                   validators=[postal_code_length])
    profit = models.FloatField()
    description = models.TextField()
