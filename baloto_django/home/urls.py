from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
<<<<<<< HEAD
=======
    path('get', views.get_data, name='get_data'),
>>>>>>> 7aadfcf05d326a538214886d51cd11d94b7d15a1
]