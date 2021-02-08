const focusSong = (state = [], action) => {
  switch (action.type) {
    case 'FOCUS_SONG':
      return action.id
    default:
      return state
  }
}

export default focusSong
