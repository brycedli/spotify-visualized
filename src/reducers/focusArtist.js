const focusArtists = (state = [], action) => {
  switch (action.type) {
    case 'FOCUS_ARTIST':
      return action.id
    default:
      return state
  }
}

export default focusArtists
