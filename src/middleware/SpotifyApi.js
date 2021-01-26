// import { normalize, schema } from 'normalizr'
import {Particle,SpecialView} from './VisualizationModels'

const API_URL    = 'https://accounts.spotify.com';
const SCOPES = [
  'user-top-read'
];
let CLIENT_ID, REDIRECT_URI;
if (process.env.NODE_ENV === 'production') {
  CLIENT_ID  = '22ca38327ff8436cbf97e5979d2eb063';
  REDIRECT_URI = 'https://brycedemos.com/visualize'; 
} else {
  CLIENT_ID  = '3811316e2e644bb893e5e868116c25c9';
  REDIRECT_URI = 'http://localhost:3000/visualize'; 
}
const MAX_SONGS = 400;
const api_session = {};
var api_session_ts = null;
const url_top_song = 'https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=10'

export const CONNECTION_URL = API_URL + '/authorize?client_id=' + CLIENT_ID +
'&redirect_uri=' + encodeURIComponent(REDIRECT_URI) +
'&scope=' + encodeURIComponent(SCOPES.join(' ')) +
'&response_type=token';


export const authenticateSpotify = (window_location)=>{
  console.log('Start spotify api authentication');
  try {
    let valid = false;
    window_location.hash.replace(/^#\/?/, '').split('&').forEach(function(kv) {
      var spl = kv.indexOf('=');
      if (spl !== -1) {
        api_session[kv.substring(0, spl)] = decodeURIComponent(kv.substring(spl+1));
        valid = true;
      }
    });
    api_session_ts =  new Date();
    console.log('api_session',api_session, "api_session_ts", api_session_ts);
    return valid;
  } catch (err) {
    return false;
  }
}

const wait = ms => new Promise((resolve) => setTimeout(resolve, ms));

export const getTopSongs =  (callback, url = url_top_song) => {
    
  fetch(url,{
      method: 'GET',
      headers:{
          'Authorization' : 'Bearer ' + api_session.access_token,
      },

  }).then((response)=>{
      return response.json();
  }).then(async (data)=> {
      //https://blog.scottlogic.com/2017/09/14/asynchronous-recursion.html
      console.log(data);
      const particles = new Map();
      if( data.items == null || data.items == undefined ){
        console.log("item not found in spotify api response");
        return;
      }

      data.items.forEach(function(item, index, array) {
          var particle = new Particle();
          particle.addTrackData(item);
          // console.log(item.track.name, item.track.artists[0].name);
          if(!item){
              console.log("item not found in initial song loop");
          }

          particles.set(item.id, particle);

      })
      // console.log(data.next, data.offset);
      callback(particles);


      //update view
      //updateFunction

      // if (maxSongs > particles.size){
      //     getTopSongs(data.next, callback);

      // }
      
      if (data.next) {
        await wait(500);
        getTopSongs(callback, data.next);
      }
  });
}