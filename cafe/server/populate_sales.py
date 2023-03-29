import random
from decimal import Decimal
from coffees_api.models import Coffee
from locations_api.models import Location
from sales_api.models import Sale

# Clean the table
Sale.objects.all().delete()

# Create the sales
created_combination = []

for i in range(75):

    while True:
        coffee_id = random.randint(7, 16)
        location_id = random.randint(1, 10)
        if (coffee_id, location_id) not in created_combination:
            break 
    
    created_combination.append((coffee_id, location_id))
    sold_coffees = random.randint(1, 10)
    coffee = Coffee.objects.get(pk=coffee_id)
    location = Location.objects.get(pk=location_id)
    sale = Sale(sold_coffees=sold_coffees, coffee_id=coffee, location_id=location)
    sale.save()