const expendList = (state = 'ARTIST', action) => {
  switch (action.type) {
    case 'TOGGLE_LIST':
      return action.expendList
    default:
      return state
  }
}

export default expendList
