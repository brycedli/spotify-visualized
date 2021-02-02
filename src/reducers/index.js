import { combineReducers } from 'redux'
import particles from './particles'
import expendList from './expendList'
import artists from './artists'


export default combineReducers({
  particles,
  expendList,
  artists
})
