from django.test import TestCase
from blends_api.models import Blend
from sales_api.models import Sale
from locations_api.models import Location
from coffees_api.models import Coffee

class SalesByLocationTest(TestCase):
    def setUp(self):
        # create test data for the Blend model
        self.blend = Blend.objects.create(name="Test Blend", description="A test blend", country_of_origin="A country", level=4, in_stock=True)

        # create test data for the Coffee model
        self.coffee1 = Coffee.objects.create(name="Coffee 1", price=2.50, calories=100, quantity=10.0, vegan=True, blend_id=self.blend)
        self.coffee2 = Coffee.objects.create(name="Coffee 2", price=2.50, calories=100, quantity=10.0, vegan=False, blend_id=self.blend)

        # create test data for the Location model
        self.location1 = Location.objects.create(name='Location 1', address='Address 1', city='City 1', postal_code='11111', profit=10000)
        self.location2 = Location.objects.create(name='Location 2', address='Address 2', city='City 2', postal_code='22222', profit=15000)
        
        # create test data for the Sale model
        Sale.objects.create(location_id=self.location2, coffee_id=self.coffee1, sold_coffees=10)
        Sale.objects.create(location_id=self.location2, coffee_id=self.coffee2, sold_coffees=5)
        Sale.objects.create(location_id=self.location1, coffee_id=self.coffee1, sold_coffees=5)

    def test_sales_by_location(self):
        response = self.client.get('/sales/sales-by-location')
        self.assertEqual(response.status_code, 200)
        expected_data = [
            {
                'location name': 'Location 2',
                'sold coffees per sale': 7.5
            },
            {
                'location name': 'Location 1',
                'sold coffees per sale': 5
            }
        ]
        self.assertEqual(response.data, expected_data)