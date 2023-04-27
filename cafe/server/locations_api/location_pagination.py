# from rest_framework.pagination import PageNumberPagination
# from rest_framework.exceptions import NotFound
# from django.core.paginator import InvalidPage

# class LocationPagination(PageNumberPagination):
#     page_size = 10
#     page_size_query_param = 'page_size'
#     max_page_size = 20
#     page_query_param = 'p'

#     def paginate_queryset(self, queryset, request, view=None):
#         page_size = self.get_page_size(request)
#         if not page_size:
#             return None

#         paginator = self.django_paginator_class(queryset, page_size)
#         page_number = request.query_params.get(self.page_query_param, 1)
#         try:
#             page = paginator.page(page_number)
#         except InvalidPage as exc:
#             message = f"Invalid page ({page_number}): {str(exc)}"
#             raise NotFound(message)

#         return page

from rest_framework.pagination import CursorPagination
from rest_framework.exceptions import NotFound


class LocationPagination(CursorPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 20
    cursor_query_param = 'cursor'
    ordering = 'id'

    def get_paginated_response(self, data):
        return {
            'count': len(data),
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'results': data
        }