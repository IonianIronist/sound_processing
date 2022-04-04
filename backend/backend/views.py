from django.shortcuts import render
from django.http import HttpResponse

def homepage(request):
    return render(request, 'index.html')

def api(request):
    if request.method == 'POST':
        with open('media/blob.wav', 'wb') as audio_file:
            audio_file.write(request.body)
        return HttpResponse("OK")
