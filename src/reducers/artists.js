import { combineReducers } from 'redux'
import { ADD_ARTISTS, ADD_SONGS } from '../constants/ActionTypes'

const artists = (state = [], action) => {
  //console.log('reducr',action);
  const newArtist = action.newArtists;
  switch (action.type) {
    case 'ADD_ARTISTS':
      return state.concat(newArtist);
    default:
      return state
  }
}

export default artists