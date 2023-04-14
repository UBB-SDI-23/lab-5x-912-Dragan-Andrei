import better_profanity
from django.db import models
from django.core.exceptions import ValidationError


def validate_blend_level(value):
    if value < 1 or value > 5:
        raise ValidationError(
            'Strength level should be an integer between 1 and 5.',
            params={'value': value})


def validate_no_profanity(value):
    if better_profanity.profanity.contains_profanity(value):
        raise ValidationError('No profanity allowed!', params={'value': value})


# Create your models here.
class Blend(models.Model):
    name = models.CharField(max_length=50,
                            unique=True,
                            validators=[validate_no_profanity])
    description = models.CharField(max_length=1000,
                                   validators=[validate_no_profanity])
    country_of_origin = models.CharField(max_length=1000,
                                         validators=[validate_no_profanity])
    level = models.IntegerField(validators=[validate_blend_level])
    in_stock = models.BooleanField()