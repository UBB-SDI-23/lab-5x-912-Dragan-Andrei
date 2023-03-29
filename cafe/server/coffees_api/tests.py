from django.test import TestCase
from rest_framework.test import APIClient
from coffees_api.models import Coffee
from blends_api.models import Blend

# Create your tests here.
class CoffeeFilterTestCase(TestCase):
    def setUp(self):     
        self.blend = Blend.objects.create(name="Test Blend", description="A test blend", country_of_origin="A country", level=4, in_stock=True)

        self.coffee_1 = Coffee.objects.create(
            name="Coffee 1", price=2.50, calories=100, quantity=10.0, vegan=True, blend_id=self.blend
        )

        self.coffee_2 = Coffee.objects.create(
            name="Coffee 2", price=3.50, calories=150, quantity=7.5, vegan=False, blend_id=self.blend
        )

        self.coffee_3 = Coffee.objects.create(
            name="Coffee 3", price=4.00, calories=200, quantity=5.0, vegan=True, blend_id=self.blend
        )

    def test_filter_by_min_price(self):
        response = self.client.get('/coffees/?min_price=2.99')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]['name'], "Coffee 2")
        self.assertEqual(response.data[1]['name'], "Coffee 3")

class OtherCoffeesByBlendsTest(TestCase):
    def setUp(self):
        # create test data for the Blend model
        self.blend1 = Blend.objects.create(name="Blend1", description="A test blend 1", country_of_origin="A country 1", level=4, in_stock=True)
        self.blend2 = Blend.objects.create(name="Blend2", description="A test blend 2", country_of_origin="A country 2", level=4, in_stock=True)

        # create test data for the Coffee model
        self.coffee1 = Coffee.objects.create(name="Coffee 1", price=2.50, calories=100, quantity=10.0, vegan=True, blend_id=self.blend1)
        self.coffee2 = Coffee.objects.create(name="Coffee 2", price=2.50, calories=100, quantity=10.0, vegan=False, blend_id=self.blend1)
        self.coffee3 = Coffee.objects.create(name="Coffee 3", price=2.50, calories=100, quantity=10.0, vegan=False, blend_id=self.blend1)
        self.coffee4 = Coffee.objects.create(name="Coffee 4", price=2.50, calories=100, quantity=10.0, vegan=False, blend_id=self.blend2)

    def test_other_coffees_by_blend(self):
        response = self.client.get('/coffees/other-coffees-by-blend')
        self.assertEqual(response.status_code, 200)

        expected_data = [
            {
                'name': 'Coffee 1',
                'coffees with similar blend': 2
            },
            {
                'name': 'Coffee 2',
                'coffees with similar blend': 2
            },
            {
                'name': 'Coffee 3',
                'coffees with similar blend': 2
            },
            {
                'name': 'Coffee 4',
                'coffees with similar blend': 0
            },
        ]
        self.assertEqual(response.data, expected_data)