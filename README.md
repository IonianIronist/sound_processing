# sound_processing
autotune app for sound processing class

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

### dependencies:
 - Node >= 14.0.0 and npm >= 5.6
 - python
 - django
 - whitenoise (for serving the static pages)
