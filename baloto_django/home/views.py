from django.http import HttpResponse    
from django.template import loader
from django.shortcuts import render

from urllib.request import urlopen
import json

def index(request):
    url = "http://localhost:8080/2019/1"
    serialized_data = urlopen(url).read()

    data = json.loads(serialized_data)

    return render(request, 'home/index.html', {"data": data})