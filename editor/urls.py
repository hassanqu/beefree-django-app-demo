from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('api/bee-auth', views.bee_auth, name='bee_auth'),
]


