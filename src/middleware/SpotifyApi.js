// import { normalize, schema } from 'normalizr'
import {Particle,SpecialView} from './VisualizationModels'

const API_URL    = 'https://accounts.spotify.com';
const SCOPES = [
  'user-top-read',
  'playlist-read-private'
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
// const url_song_features = 
const url_playlists = 'https://api.spotify.com/v1/me/playlists';
const url_playlistContent = 'https://api.spotify.com/v1/playlists/';

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

function getFeatureData(callback, songs){
  var featureURL = 'https://api.spotify.com/v1/audio-features?ids=' + songs.join(",");

  console.log("Getting feature data for", songs.length, "songs");
  fetch(featureURL,{
    method: 'GET',
    headers:{
        'Authorization' : 'Bearer ' + api_session.access_token,
    },

  }).then((response)=>{
    return response.json();
  }).then(async (data)=> {

    //https://blog.scottlogic.com/2017/09/14/asynchronous-recursion.html
    // console.log(data);
    // const particles = new Map();
    if( data.audio_features == null || data.audio_features == undefined ){
      console.log("item not found in spotify api response");
      return;
    }
    callback(data.audio_features);
    // data.audio_features.forEach(function(item, index, array) {
      
    //   var particleFromBatch = currentBatch.get(item.id);
    //   particleFromBatch.addFeatureData(item);
    //   particles.set(item.id, particleFromBatch);
    // })

    // callback(particles);

    
  });
}

const wait = ms => new Promise((resolve) => setTimeout(resolve, ms));
export const getPlaylistSongs = (callback, url = url_playlists) => {
  var playlistBatch = new Map();

  fetch(url,{
    method: 'GET',
      headers:{
          'Authorization' : 'Bearer ' + api_session.access_token,
      },
  }).then((response)=>{
    return response.json();
  }).then(async (data)=> {
    //https://blog.scottlogic.com/2017/09/14/asynchronous-recursion.html
    // console.log(data);
    // const particles = new Map();
    if( data.items == null || data.items == undefined ){
      console.log("item not found in spotify api response");
      return;
    }

    

    function playlistContent(url, callback){ //initally called once per playlist, recurvsively calls itself every time it 
      console.log(url, callback);
      fetch(url, {
        method: 'GET',
          headers:{
              'Authorization' : 'Bearer ' + api_session.access_token,
          },
      }).then((response)=>{
        return response.json();
      }).then(async (data) => {
        //fetched playlist metadata. contine recursively doing that.
        
        callback(data); //1 batch (~20 songs) of data.  

        if (data.next){ 
          playlistContent(data.next, callback);
        }
      });

    }
    console.log('playlists',data.items);
    data.items.forEach(function(item) { //iterate through every playlist
      // console.log("getting playlist:" , item);
      playlistContent(url_playlistContent+item.id, function (items) {
        //This callback funciton may be called multiple times per playlist. callback called with json playlist.tracks->trackdata from playlist.
        console.log(items);
        var particle = new Particle();
        particle.addTrackData(item);
        if(!item){
          console.log("item not found in initial song loop");
        }
        playlistBatch.set(item.id, particle);
        // var trackCombined = '';
        // items.tracks.forEach(function(song){
        //   trackCombined = trackCombined + song.id;
        // })
        // console.log(trackCombined);
      });
      // console.log(playlistBatch);

      callback(playlistBatch);
    })
    
    if (data.next) {
      await wait(500);
      getPlaylistSongs(callback, data.next);
    }
});
}
export const getTopSongs =  (callback, url = url_top_song) => {
  // test();
  var currentBatch = new Map();
  fetch(url,{
      method: 'GET',
      headers:{
          'Authorization' : 'Bearer ' + api_session.access_token,
      },

  }).then((response)=>{
      return response.json();
  }).then(async (data)=> {
      //https://blog.scottlogic.com/2017/09/14/asynchronous-recursion.html
      // console.log(data);
      const particles = new Map();
      if( data.items == null || data.items == undefined ){
        console.log("item not found in spotify api response");
        return;
      }

      data.items.forEach(function(item) {
          var particle = new Particle();
          particle.addTrackData(item);
          // console.log(item.track.name, item.track.artists[0].name);
          if(!item){
              console.log("item not found in initial song loop");
          }

          // particles.set(item.id, particle);
          currentBatch.set(item.id, particle);
          

      })
      //start getting features
      var songIDsBatch = [];
      //GET https://api.spotify.com/v1/audio-analysis/{id}
      currentBatch.forEach(function (item, index, array) {
        songIDsBatch.push(item.getTrackData().id);
          // console.log(item.getTrackData().id); 
      });

      function whenFeatureDone(audioFeatures){
        audioFeatures.forEach(function(item, index, array) {
          
          var particleFromBatch = currentBatch.get(item.id);
          particleFromBatch.addFeatureData(item);
          particles.set(item.id, particleFromBatch);
        });
        callback(particles);
      }
      getFeatureData(whenFeatureDone, songIDsBatch); //should callback whenFeatureDone when done getting features. good name haha

      // console.log(songIDsBatch);
      
      if (data.next) {
        await wait(500);
        getTopSongs(callback, data.next);
      }
  });
}