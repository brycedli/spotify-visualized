import { combineReducers } from 'redux'
import focusSongs from './focusSongs'
import expendList from './expendList'
import artists from './artists'
import songs from './songs'


export default combineReducers({
  focusSongs,
  expendList,
  artists,
  songs
})
