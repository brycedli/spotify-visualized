const particles = (state = [], action) => {
  switch (action.type) {
    case 'PARTICLES':
      return action.particles
      // const _state = state.concat(action.particles)
      // return _state
      // return [
      //   ...state,
      //   action.particles
      // ]
    default:
      return state
  }
}

export default particles
