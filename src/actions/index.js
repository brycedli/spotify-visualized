
import { ADD_ARTISTS, ADD_SONGS } from '../constants/ActionTypes'

export const addParticles = particles => ({
  type: 'ADD_PARTICLES',
  particles
})

export const focusSongs = focusSongs => ({
  type: 'FOCUS_SONGS',
  focusSongs
})


export const addSongs = newSongs => ({
  type: 'ADD_SONGS',
  newSongs
})

export const addPlaylists = playlists => ({
  type: 'ADD_PLAYLISTS',
  playlists
})

export const expendList = expendList => ({
  type: 'TOGGLE_LIST',
  expendList
})

export const addArtists = newArtists => ({
  type: 'ADD_ARTISTS',
  newArtists
})


