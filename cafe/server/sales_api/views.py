from django.db.models import Avg
from rest_framework.views import APIView
from rest_framework.response import Response

from sales_api.models import Sale
from locations_api.models import Location

class SalesByLocation(APIView):
    def get(self, request):
        # order the locations by their number of sold coffees sold per sale
        sales_data = Sale.objects.values('location_id').annotate(avg_sold_coffees=Avg('sold_coffees')).order_by('-avg_sold_coffees')

        result = []
        for data in sales_data:
            location = Location.objects.get(pk=data['location_id'])
            result.append({
                'location name': location.name,
                'sold coffees per sale': data['avg_sold_coffees']
            })

        return Response(result)
