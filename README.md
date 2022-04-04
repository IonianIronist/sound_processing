# sound_processing
autotune app for sound processing class

### dependencies:
 - Node >= 14.0.0 and npm >= 5.6
 - python
 - django
 - whitenoise (for serving the static pages)

## developing the frontend

after applying changes to the react run: 

    npm run build

to build the app and check the changes to frontend only

    npm run relocate

to build the app and move the static files to backend for serving

## developing the backend

run the server with 

    python manage.py runserver

changes are mostly applied automatically


## instruction for winboz users


    choco install nvs

    nvs add 17.4.0

    nvs use 17

    git clone https://github.com/IonianIronist/sound_processing

    cd sound_processing

    cd frontend

    npm install


go to root project dir



    py -m venv ./env

    ./env/Scripts/activate

    pip install ./backend/dependencies

    cd backend

    mkdir media && make dir build



from the frontend dir



    npm run build



copy the build dir contents to backend/build

from the backend dir run:


    py manage.py runserver





