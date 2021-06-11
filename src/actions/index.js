
import { ADD_ARTISTS, ADD_SONGS } from '../constants/ActionTypes'

export const addParticles = particles => ({
  type: 'ADD_PARTICLES',
  particles
})

export const focusSong = id => ({
  type: 'FOCUS_SONG',
  id
})

export const focusArtist = id => ({
  type: 'FOCUS_ARTIST',
  id
})

export const addSongs = newSongs => ({
  type: 'ADD_SONGS',
  newSongs
})

export const addPlaylists = playlists => ({
  type: 'ADD_PLAYLISTS',
  playlists
})

export const reportListToggleStatus = (list,status) => ({
  type: 'LIST_STATUS',
  reportListToggleStatus:{list:list,status:status}
})

export const addArtists = newArtists => ({
  type: 'ADD_ARTISTS',
  newArtists
})


