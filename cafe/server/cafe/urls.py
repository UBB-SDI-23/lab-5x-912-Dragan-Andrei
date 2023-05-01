from django.contrib import admin
from django.urls import path, include
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="Cafe API",
        default_version='v1',
    ),
    public=True,
)

urlpatterns = [
    path('api/admin/', admin.site.urls),
    path('api/coffees/', include('coffees_api.urls')),
    path('api/blends/', include('blends_api.urls')),
    path('api/locations/', include('locations_api.urls')),
    path('api/sales/', include('sales_api.urls')),
    path('api/swagger/',
         schema_view.with_ui('swagger', cache_timeout=0),
         name='schema-swagger-ui'),
]
