from django.db import models
import better_profanity
from django.core.exceptions import ValidationError


def validate_positive(value):
    if value < 0:
        raise ValidationError('%(value)s is not a positive number.',
                              params={'value': value})


def validate_gender(value):
    if value != 'M' and value != 'F' and value != 'O':
        raise ValidationError(
            "gender can only be described as 'M' - male, 'F' - female or 'O' - other",
            params={'value': value})


def validate_no_profanity(value):
    if better_profanity.profanity.contains_profanity(value):
        raise ValidationError('No profanity allowed!', params={'value': value})


class Profile(models.Model):
    id = models.AutoField(primary_key=True)
    bio = models.TextField(max_length=500,
                           blank=True,
                           validators=[validate_no_profanity])
    age = models.IntegerField(null=True,
                              blank=True,
                              validators=[validate_positive])
    gender = models.CharField(max_length=1,
                              blank=True,
                              validators=[validate_gender])
    nationality = models.CharField(max_length=100, blank=True)
    favourite_flavour = models.CharField(max_length=100, blank=True)
    confirmation_code = models.CharField(max_length=12, blank=True)
    confirmation_code_valid_until = models.DateTimeField(null=True, blank=True)
    user_id = models.ForeignKey('auth.User', on_delete=models.CASCADE)
