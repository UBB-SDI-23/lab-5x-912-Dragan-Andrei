from rest_framework.views import APIView
from coffees_api.models import Coffee
from coffees_api.serializer import CoffeeSerializer
from rest_framework.response import Response
from rest_framework import status

from blends_api.serializer import BlendSerializer
from blends_api.models import Blend
from sales_api.models import Sale
from sales_api.serializer import SaleSerializer

class Coffees(APIView):
    def get(self, request):
        filtered_coffees = Coffee.objects.all()
        coffee_top_price = self.request.query_params.get('min_price')
        if coffee_top_price is not None:
            filtered_coffees = filtered_coffees.filter(price__gt=coffee_top_price)

        serialized_coffees = CoffeeSerializer(filtered_coffees, many=True)
        return Response(serialized_coffees.data)

    def post(self, request):
        serialized_coffee = CoffeeSerializer(data=request.data)
        if serialized_coffee.is_valid():
            serialized_coffee.save()
            return Response(serialized_coffee.data)
        return Response(serialized_coffee.errors, status=status.HTTP_400_BAD_REQUEST)

class CoffeeDetail(APIView):
    def get(self, request, pk):
        try:
            coffee = Coffee.objects.get(pk=pk)
            serialized_coffee = CoffeeSerializer(coffee)

            # get the referenced blend (the 1-to-many relation)
            serialized_blend = BlendSerializer(coffee.blend_id)

            # get the referenced entries inside the many-to-many relation between coffees and locations
            sales = Sale.objects.filter(coffee_id=pk)
            serialized_sales = SaleSerializer(sales, many=True)

            # get the attributes of the coffee object
            serialized_coffee_data = serialized_coffee.data

            # add the blend to the JSON's coffee object, by also removing the blend_id, since it's already inside the body of the blend itself
            del serialized_coffee_data['blend_id']
            serialized_coffee_data['blend'] = serialized_blend.data

            # add the array of sales to the JSON's coffee object, by removing the "coffee_id"
            for sale in serialized_sales.data:
                sale['revenue'] = round(sale['revenue'], 2)
                del sale['coffee_id']
            serialized_coffee_data['sales'] = serialized_sales.data

            return Response(serialized_coffee_data)
        except:
            return Response({
                'error': 'Coffee does not exist'
            },
            status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, pk):
        try:
            coffee = Coffee.objects.get(pk=pk)
            serialized_coffee = CoffeeSerializer(coffee, data=request.data)
            if serialized_coffee.is_valid():
                serialized_coffee.save()
                return Response(serialized_coffee.data)
            return Response(serialized_coffee.errors, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({
                'error': 'Coffee does not exist'
            },
            status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        try:
            coffee = Coffee.objects.get(pk=pk)
            coffee.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except:
            return Response({
                'error': 'Coffee does not exist'
            },
            status=status.HTTP_400_BAD_REQUEST)
        
class OtherCoffeesByBlends(APIView):
    def get(self, request):
        # show all coffees sorted by the number of other coffees that contain the same blend
        coffees_with_similar_blend = {}

        for blend in Blend.objects.all():
            coffees_data = Coffee.objects.filter(blend_id=blend)
            for coffee in coffees_data: 
                serialized_coffee = CoffeeSerializer(coffee)
                coffees_with_similar_blend[serialized_coffee.data['id']] = len(coffees_data) - 1

        answer = []
        for coffee in Coffee.objects.all():
            serialized_coffee = CoffeeSerializer(coffee)
           
            if coffees_with_similar_blend[serialized_coffee.data['id']]:
                answer.append({
                    'name': serialized_coffee.data['name'],
                    'coffees with similar blend': coffees_with_similar_blend[serialized_coffee.data['id']]
                })
            else:
                answer.append({
                    'name': serialized_coffee.data['name'],
                    'coffees with similar blend': 0
                })

        answer.sort(key = lambda x : x['coffees with similar blend'], reverse=True)
        return Response(answer)