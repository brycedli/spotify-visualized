 

# spotify-visualized

This page visualizes song metadata from your favorite songs. It plots abstract song attributes such as valence (a measure of mood), acousticness, and energy. These song attributes are used as parameters in Spotify's recommendation algorithm. This is my first full-stack web application, and my first experience with both frontend and backend development.

Frontend tools: Spotify Web API, three.js

Backend tools: Nginx, Django, UWSGI

Hosted with Google Cloud Run


# Known bugs
```
1.) Safari sometimes doesn't load the redirect URI properly. This issue does not happen on localhost. (Suspect it may be a server side problem)

2.) Old cache is loaded if not expired when website is updated, especially pronounced with broken CSS loading GIF
```
