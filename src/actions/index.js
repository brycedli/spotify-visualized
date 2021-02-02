
import { ADD_ARTISTS, ADD_SONGS } from '../constants/ActionTypes'

export const addParticles = particles => ({
  type: 'ADD_PARTICLES',
  particles
})

export const addSongs = songs => ({
  type: 'ADD_SONGS',
  songs
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


