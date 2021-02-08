import { combineReducers } from 'redux'
import { ADD_ARTISTS, ADD_SONGS } from '../constants/ActionTypes'

const songs = (state = [], action) => {
  // console.log('reducr',action);
  const newSongs = action.newSongs;
  switch (action.type) {
    case 'ADD_SONGS':
      return state.concat(newSongs);
    default:
      return state
  }
}

export default songs