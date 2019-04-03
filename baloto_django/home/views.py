from django.http import JsonResponse    
from django.template import loader
from django.shortcuts import render

from urllib.request import urlopen
import json
import datetime

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
    cont = 50
    url = "http://localhost:8080"
    
    serialized_data = bytes()
    
    data = []
    while(date_iter < end_date):
        cont = cont - 1
        date_iter = date_iter + datetime.timedelta(365 / 12) 
        url_fixed = "{0}/{1}/{2}".format(url, date_iter.year, date_iter.month)
        print("URL", url_fixed)
        serialized_data = urlopen(url_fixed).read()
        myjson = json.loads(serialized_data)
        key = str(date_iter.year) + "/" + str(date_iter.month)
        data.append({key: myjson})
        print(date_iter)
    
    print(data)
    return JsonResponse({"data": data})