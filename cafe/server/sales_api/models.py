from django.db import models
from coffees_api.models import Coffee
from locations_api.models import Location
from django.core.exceptions import ValidationError


def validate_positive(value):
    if value < 0:
        raise ValidationError('%(value)s is not a positive number',
                              params={'value': value})


# Create your models here.
class Sale(models.Model):
    sold_coffees = models.IntegerField(validators=[validate_positive])
    revenue = models.FloatField(null=True, validators=[validate_positive])
    coffee_id = models.ForeignKey(Coffee, on_delete=models.CASCADE)
    location_id = models.ForeignKey(Location, on_delete=models.CASCADE)

    class Meta:
        unique_together = (("coffee_id", "location_id"), )

    def save(self, *args, **kwargs):
        self.revenue = self.sold_coffees * self.coffee_id.price
        super().save(*args, **kwargs)