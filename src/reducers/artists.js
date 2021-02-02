import { combineReducers } from 'redux'
import { ADD_ARTISTS, ADD_SONGS } from '../constants/ActionTypes'

const artists = (state = [], action) => {
  console.log('reducr',action);
  const newArtist = action.newArtists;
  switch (action.type) {
    case 'ADD_ARTISTS':
      // action.artists.forEach(a=>{
      //   state.push(a);
      // });
      // return state;
      
      return [
        ...state,
        {
          id: newArtist.id,
          name: newArtist.name,
          thumbnail_url: newArtist.thumbnail_url,
          genre: newArtist.genre
        }
      ]
    default:
      return state
  }
}

export default artists