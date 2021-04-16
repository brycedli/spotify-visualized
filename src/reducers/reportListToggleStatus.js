const reportListToggleStatus = (state = '', action) => { //ARTIST
  switch (action.type) {
    case 'LIST_STATUS':
      return action.reportListToggleStatus
    default:
      return state
  }
}

export default reportListToggleStatus
