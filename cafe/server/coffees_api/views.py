from rest_framework.views import APIView
from coffees_api.models import Coffee
from coffees_api.serializer import CoffeeSerializer
from rest_framework.response import Response
from rest_framework import status
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

from blends_api.serializer import BlendSerializer
from blends_api.models import Blend
from sales_api.models import Sale
from sales_api.serializer import SaleSerializer

class Coffees(APIView):
    @swagger_auto_schema(
        operation_description="Get a list of all coffees",
        responses={
            status.HTTP_200_OK: openapi.Response(
                description="List of all coffees",
                schema=CoffeeSerializer(many=True)
            ),
            status.HTTP_400_BAD_REQUEST: openapi.Response(
                description="Error message",
                schema=openapi.Schema(type=openapi.TYPE_OBJECT, properties={
                    'error': openapi.Schema(type=openapi.TYPE_STRING)
                })
            )
        }
    )
    def get(self, request):
        filtered_coffees = Coffee.objects.all()
        coffee_top_price = self.request.query_params.get('min_price')
        if coffee_top_price is not None:
            filtered_coffees = filtered_coffees.filter(price__gt=coffee_top_price)

        serialized_coffees = CoffeeSerializer(filtered_coffees, many=True)
        return Response(serialized_coffees.data)

    @swagger_auto_schema(
        operation_description="Create a new coffee",
        request_body=CoffeeSerializer,
        responses={
            status.HTTP_200_OK: openapi.Response(
                description="Created coffee",
                schema=CoffeeSerializer()
            ),
            status.HTTP_400_BAD_REQUEST: openapi.Response(
                description="Error message",
                schema=openapi.Schema(type=openapi.TYPE_OBJECT, properties={
                    'error': openapi.Schema(type=openapi.TYPE_STRING)
                })
            )
        }
    )
    def post(self, request):
        serialized_coffee = CoffeeSerializer(data=request.data)
        if serialized_coffee.is_valid():
            serialized_coffee.save()
            return Response(serialized_coffee.data)
        return Response(serialized_coffee.errors, status=status.HTTP_400_BAD_REQUEST)

class CoffeeDetail(APIView):
    @swagger_auto_schema(
        operation_description="Get a coffee by id",
        responses={
            status.HTTP_200_OK: openapi.Response(
                description="Coffee",
                schema=openapi.Schema(type=openapi.TYPE_OBJECT, properties={
                    'id': openapi.Schema(type=openapi.TYPE_INTEGER),
                    'name': openapi.Schema(type=openapi.TYPE_STRING),
                    'price': openapi.Schema(type=openapi.TYPE_NUMBER),
                    'blend_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                    'blend': openapi.Schema(type=openapi.TYPE_OBJECT, properties={
                        'id': openapi.Schema(type=openapi.TYPE_INTEGER),
                        'name': openapi.Schema(type=openapi.TYPE_STRING),
                        'roast': openapi.Schema(type=openapi.TYPE_STRING)
                    }),
                    'sales': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_OBJECT, properties={
                        'id': openapi.Schema(type=openapi.TYPE_INTEGER),
                        'location_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                        'revenue': openapi.Schema(type=openapi.TYPE_NUMBER)
                    }))
                })
            ),
            status.HTTP_400_BAD_REQUEST: openapi.Response(
                description="Error message",
                schema=openapi.Schema(type=openapi.TYPE_OBJECT, properties={
                    'error': openapi.Schema(type=openapi.TYPE_STRING)
                })
            )
        }
    )
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
    
    @swagger_auto_schema(
        operation_description="Update a coffee by id",
        request_body=CoffeeSerializer,
        responses={
            status.HTTP_200_OK: openapi.Response(
                description="Updated coffee",
                schema=CoffeeSerializer()
            ),
            status.HTTP_400_BAD_REQUEST: openapi.Response(
                description="Error message",
                schema=openapi.Schema(type=openapi.TYPE_OBJECT, properties={
                    'error': openapi.Schema(type=openapi.TYPE_STRING)
                })
            )
        }
    )
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
    
    @swagger_auto_schema(
        operation_description="Delete a coffee by id",
        responses={
            status.HTTP_204_NO_CONTENT: openapi.Response(
                description="Deleted coffee"
            ),
            status.HTTP_400_BAD_REQUEST: openapi.Response(
                description="Error message",
                schema=openapi.Schema(type=openapi.TYPE_OBJECT, properties={
                    'error': openapi.Schema(type=openapi.TYPE_STRING)
                })
            )
        }
    )
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
    @swagger_auto_schema(
        operation_description="Get all coffees sorted by the number of other coffees that contain the same blend",
        responses={
            status.HTTP_200_OK: openapi.Response(
                description="Coffees",
                schema=openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_OBJECT, properties={
                    'name': openapi.Schema(type=openapi.TYPE_STRING),
                    'coffees with similar blend': openapi.Schema(type=openapi.TYPE_INTEGER)
                }))
            )
        }
    )
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