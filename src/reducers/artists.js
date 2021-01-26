import { combineReducers } from 'redux'
import { ADD_ARTISTS, ADD_SONGS } from '../constants/ActionTypes'

const artists = (state, action) => {
  switch (action.type) {
    case ADD_ARTISTS:
      return {
        ...state,
        inventory: state.inventory - 1
      }
    default:
      return state
  }
}