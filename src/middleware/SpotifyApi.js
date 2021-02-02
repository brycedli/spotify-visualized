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
const url_artist = 'https://api.spotify.com/v1/artists';

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
    // console.log(data);
    // if (data.next) {
    //   console.log("more songs");

    //   await wait(500);
    //   // getFeatureData(callback, data.next);
    // }
    // data.audio_features.forEach(function(item, index, array) {
      
    //   var particleFromBatch = currentBatch.get(item.id);
    //   particleFromBatch.addFeatureData(item);
    //   particles.set(item.id, particleFromBatch);
    // })

    // callback(particles);

    
  });
}

const wait = ms => new Promise((resolve) => setTimeout(resolve, ms));
function playlistContent(url, callbackPlaylist){ //initally called once per playlist, recurvsively calls itself every time it 
  // console.log(url, callback);
  fetch(url, {
    method: 'GET',
      headers:{
          'Authorization' : 'Bearer ' + api_session.access_token,
      },
  }).then((response)=>{
    return response.json();
  }).then(async (data) => {
    //fetched playlist metadata. contine recursively doing that.
    if (data.items){
      console.log("data items");
      callbackPlaylist(data.items);
    }
    else if (data.tracks){
      console.log("data tracks");
      callbackPlaylist(data.tracks.items);
    }
    // callback( data); //1 batch (~20 songs) of data.  


    if (data.tracks && data.tracks.next){      
      
      await wait(50);
      // getTopSongs(callback, data.next);
      
      // console.log("playlistContent", url, data.tracks.next);
      playlistContent(data.tracks.next, callbackPlaylist);
    }
  });

}

export const getPlaylistSongs = (callback, url = url_playlists) => {
  
  const MAX_PL_BATCH = 10;
  const MAX_PL_CONTENT_BATCH = 10;
  let playlistBatchCnt = 0;
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
    const playlistBatch = new Map();
    if( data.items == null || data.items == undefined ){
      console.log("item not found in spotify api response");
      return;
    }
    let playlistContentBatchCnt = 0;
    // console.log('playlists',data.items);
    data.items.forEach(function(item) { //iterate through every playlist
      // console.log("getting playlist:" , item);
      if (playlistContentBatchCnt > MAX_PL_CONTENT_BATCH) {
        return;
      }
      playlistContentBatchCnt += 1;
      playlistContent(url_playlistContent+item.id,  function (songs) {
        // console.log(songs);
        songs.forEach(function(indivSong){//iterate through each song
          if (indivSong.track == null) {
            console.log('track',indivSong.track);
            return;
          }
          var particle = new Particle();
          particle.addTrackData(indivSong.track)
          playlistBatch.set(indivSong.track.id, particle);
        })

        var featureBundle = [];
        songs.forEach(function (song){
          if (song.track != null) {
            featureBundle.push(song.track.id);
          }
        })
        // await wait(500);
        getFeatureData( function (audioFeatures){
          // console.log("feature", featureBundle, audioFeatures);
          const playlistCallbackBatch = new Map();
          audioFeatures.forEach(function(item, index, array) {
            if (item == null) {
              return;
            }
            var particleFromBatch = playlistBatch.get(item.id);
            particleFromBatch.addFeatureData(item);
            playlistBatch.set(item.id, particleFromBatch);
            playlistCallbackBatch.set(item.id, particleFromBatch);
            
          });
          callback(playlistCallbackBatch);
          // callback(playlistBatch);
        }, featureBundle);
        //This callback funciton may be called multiple times per playlist. callback called with json playlist.tracks->trackdata from playlist.
        // if (items.items){//pretty sure this is the next function
        //   console.log("this item has items for some reason", items);
        //   items.items.forEach(function(trackItem){
        //     var particle = new Particle();
        //     particle.addTrackData(trackItem);
        //     if(!trackItem){
        //       console.log("item not found in initial song loop");
        //     }
        //     playlistBatch.set(trackItem.id, particle);
  
        //   })
        // }
        // if (items.tracks){
        //   console.log("this item has tracks for some reason", items);
        //   items.tracks.items.forEach(function(trackItem){
        //     var particle = new Particle();
        //     particle.addTrackData(trackItem);
        //     if(!trackItem){
        //       console.log("item not found in initial song loop");
        //     }
        //     playlistBatch.set(trackItem.id, particle);
  
        //   })
        // }

        // callback(playlistBatch);

        // console.log(items.items);
        
        
        // var trackCombined = '';
        // items.tracks.forEach(function(song){
        //   trackCombined = trackCombined + song.id;
        // })
        // console.log(trackCombined);
      });
      // console.log(playlistBatch);

      // callback(playlistBatch);
    })
    playlistBatchCnt += 1;
    console.log('playlistBatchCnt',playlistBatchCnt, 'MAX_PL_BATCH',MAX_PL_BATCH);
    if (data.next && playlistBatchCnt < MAX_PL_BATCH) {
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
      //console.log(data);
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


export const getArtists = (callback, artists) => {
  var artistsURL = url_artist + '?ids=' + artists.join(",");
  console.log('artists',artists);
  console.log("Getting artist data for", artists.length, "artists");
  fetch(artistsURL,{
    method: 'GET',
    headers:{
        'Authorization' : 'Bearer ' + api_session.access_token,
    },

  }).then((response)=>{
    return response.json();
  }).then(async (data)=> {
    console.log(data);
    if( data.artists == null || data.artists == undefined ){
      console.log("artists not found in spotify api response");
      return;
    }
    callback(data.artists);
  });
}