from django.urls import path
from django.views.decorators.csrf import csrf_exempt

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('get-data', views.get_data, name='get_data'),
    path('get-stats', csrf_exempt(views.get_stats), name='get-stats') #NOT 403 Forbidden
]