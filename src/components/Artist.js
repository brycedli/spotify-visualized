import React from 'react'
import PropTypes from 'prop-types'

const Artist = ({ id, name, thumbnail_url, genre }) => (
  <li
    // onClick={onClick}
    style={{
      // textDecoration: completed ? 'line-through' : 'none'
    }}
  >
    {name} {genre}
  </li>
)

Artist.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  thumbnail_url: PropTypes.string.isRequired,
  genre: PropTypes.string.isRequired
}

export default Artist