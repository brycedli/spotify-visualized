// import { normalize, schema } from 'normalizr'

const API_URL    = 'https://accounts.spotify.com';
const SCOPES = [
  'user-top-read'
];
let CLIENT_ID, REDIRECT_URI;
if (process.env.NODE_ENV === 'production') {
  CLIENT_ID  = '22ca38327ff8436cbf97e5979d2eb063';
  REDIRECT_URI = 'https://brycedemos.com'; 
} else {
  CLIENT_ID  = '22ca38327ff8436cbf97e5979d2eb063';
  REDIRECT_URI = 'http://localhost:3000'; 
}

export const CONNECTION_URL = API_URL + '/authorize?client_id=' + CLIENT_ID +
'&redirect_uri=' + encodeURIComponent(REDIRECT_URI) +
'&scope=' + encodeURIComponent(SCOPES.join(' ')) +
'&response_type=token';

export const authenticateSpotify = ()=>{
  console.log('Start spotify api authentication');
}