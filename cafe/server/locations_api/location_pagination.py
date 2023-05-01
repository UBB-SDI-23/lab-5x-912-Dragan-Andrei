from rest_framework.pagination import LimitOffsetPagination
from rest_framework.response import Response


class LocationPagination(LimitOffsetPagination):
    default_limit = 10
    max_limit = 20
    limit_query_param = 'limit'
    offset_query_param = 'offset'

    def get_paginated_response(self, data):
        return Response({
            'count': self.count,
            'page': int(self.offset / self.limit) + 1,
            'results': data
        })