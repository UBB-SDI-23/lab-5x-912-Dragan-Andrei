import better_profanity
from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model

User = get_user_model()


def postal_code_length(value):
    if len(value) != 5:
        raise ValidationError(
            'Postal code should have a fixed length of 5 characters.')


def validate_no_profanity(value):
    if better_profanity.profanity.contains_profanity(value):
        raise ValidationError('No profanity allowed!', params={'value': value})


class Location(models.Model):
    name = models.CharField(max_length=50, validators=[validate_no_profanity])
    address = models.CharField(max_length=1000,
                               validators=[validate_no_profanity])
    city = models.CharField(max_length=1000,
                            validators=[validate_no_profanity])
    postal_code = models.CharField(max_length=50,
                                   validators=[postal_code_length])
    profit = models.FloatField()
    description = models.TextField(validators=[validate_no_profanity])
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
