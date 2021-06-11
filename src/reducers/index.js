import { combineReducers } from 'redux'
import focusSong from './focusSong'
import focusArtist from './focusArtist'
import reportListToggleStatus from './reportListToggleStatus'
import artists from './artists'
import songs from './songs'


export default combineReducers({
  focusSong,
  focusArtist,
  reportListToggleStatus,
  artists,
  songs
})
