import React from 'react'
import PropTypes from 'prop-types'
import Todo from './Artist'

const ArtistList = ({ artists, toggleFullList }) => (
  <div>
    <div>
      Your Top Artists
    </div>
    {/* <ul>
      {artists.map(artist =>
        <Artist
          key={artist.id}
          {...artist}
          onClick={() => toggleFullList()}
        />
      )}
    </ul> */}
    <div>
      <span>
        SEE MORE ARTISTS
      </span>
    </div>
  </div>
  
)

ArtistList.propTypes = {
  artists: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    genre: PropTypes.string.isRequired
  }).isRequired).isRequired,
  toggleFullList: PropTypes.func.isRequired
}

export default ArtistList
