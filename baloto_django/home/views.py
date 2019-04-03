from django.http import JsonResponse    
from django.template import loader
from django.shortcuts import render

from urllib.request import urlopen
import json
import datetime


import numpy

def index(request):
    return render(request, 'home/index.html')


"""
DATE FORMAT: YYYY/MM/DD
"""
def get_data(request):
    #Getting params
    start_date = request.GET["start-date"].split("-")
    end_date = request.GET["end-date"].split("-")

    #Parsing to dates
    start_date = datetime.datetime(int(start_date[0]), int(start_date[1]), int(start_date[2]))
    end_date = datetime.datetime(int(end_date[0]), int(end_date[1]), int(end_date[2]))

    print("Start date: ", start_date, "End date: ", end_date)
    date_iter = start_date
    url = "https://baloto-wsapi.herokuapp.com"
    
    serialized_data = bytes()
    
    data = []
    while(date_iter < end_date):
        date_iter = date_iter + datetime.timedelta(365 / 12) 
        url_fixed = "{0}/{1}/{2}".format(url, date_iter.year, date_iter.month)
        print("Calling URL: ", url_fixed)
        serialized_data = urlopen(url_fixed).read()
        myjson = json.loads(serialized_data)
        key = str(date_iter.year) + "/" + str(date_iter.month)
        data.append(myjson)
        print("ACTUAL MONTH: ", date_iter)    
    print(data)
    return JsonResponse({"data": data})


def get_stats(request):
    if request.method == "POST":
        body = get_body(request)
        data = body["data"]
        print(data)
        mean = numpy.mean(data) 
        sd = numpy.std(data)
        return JsonResponse({"mean": mean, "sd": sd, "var": sd **2})

def get_body(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    return body