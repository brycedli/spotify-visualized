import { combineReducers } from 'redux'
import focusSong from './focusSong'
import focusArtist from './focusArtist'
import expendList from './expendList'
import artists from './artists'
import songs from './songs'


export default combineReducers({
  focusSong,
  focusArtist,
  expendList,
  artists,
  songs
})
