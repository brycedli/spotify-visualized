import React from 'react'
import PropTypes from 'prop-types'

const Artist = ({ onClick, id, name, url, genre }) => (
  <li
    onClick={onClick}
    style={{
      // textDecoration: completed ? 'line-through' : 'none'
    }}
  >
    {name}
  </li>
)

Artist.propTypes = {
  onClick: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  genre: PropTypes.string.isRequired
}

export default Artist