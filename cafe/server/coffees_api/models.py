import better_profanity
from django.db import models
from blends_api.models import Blend
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model

User = get_user_model()


def validate_positive(value):
    if value < 0:
        raise ValidationError('%(value)s is not a positive number.',
                              params={'value': value})


def validate_calories(value):
    if (value > 1000):
        raise ValidationError(
            'A coffee with that many calories cannot be sold.',
            params={'value': value})


def validate_no_profanity(value):
    if better_profanity.profanity.contains_profanity(value):
        raise ValidationError('No profanity allowed!', params={'value': value})


# Create your models here.
class Coffee(models.Model):
    name = models.CharField(max_length=50, validators=[validate_no_profanity])
    price = models.FloatField(validators=[validate_positive])
    calories = models.IntegerField(
        validators=[validate_positive, validate_calories])
    quantity = models.FloatField(validators=[validate_positive])
    vegan = models.BooleanField()
    blend_id = models.ForeignKey(Blend,
                                 on_delete=models.CASCADE,
                                 default=1,
                                 related_name="coffees")
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.name