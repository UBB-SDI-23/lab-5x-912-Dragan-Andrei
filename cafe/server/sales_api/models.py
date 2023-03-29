from django.db import models
from coffees_api.models import Coffee 
from locations_api.models import Location


# Create your models here.
class Sale(models.Model):
    sold_coffees = models.IntegerField()
    revenue = models.FloatField(null=True)
    coffee_id = models.ForeignKey(Coffee, on_delete=models.CASCADE)
    location_id = models.ForeignKey(Location, on_delete=models.CASCADE)

    class Meta:
        unique_together = (("coffee_id", "location_id"),)

    def save(self, *args, **kwargs):
        self.revenue = self.sold_coffees * self.coffee_id.price
        super().save(*args, **kwargs)