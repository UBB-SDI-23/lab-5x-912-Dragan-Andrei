from rest_framework.pagination import PageNumberPagination


class SalePagination(PageNumberPagination):
    page_size = 10