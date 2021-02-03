const focusSongs = (state = [], action) => {
  switch (action.type) {
    case 'FOCUS_SONGS':
      return action.focusSongs
    default:
      return state
  }
}

export default focusSongs
