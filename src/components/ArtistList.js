import React from 'react'
import PropTypes from 'prop-types'
import Artist from './Artist'


class ArtistList extends React.Component {

  render() {
    const { artists, toggleFullList } = this.props;

    return (
      <div>
        <div>
          Your Top Artists
        </div>
        <ul>
          {artists.map(artist =>
            <Artist
              key={artist.id}
              {...artist}
              // onClick={() => toggleFullList()}
            />
          )}
        </ul>
        <div>
          <span>
            SEE MORE ARTISTS
          </span>
        </div>
      </div>
    )
  }
}

ArtistList.propTypes = {
  artists: PropTypes.array.isRequired,
  toggleFullList: PropTypes.bool.isRequired
}

ArtistList.defaultProps = {
  artists: [
    {
      id: 'a1',
      name: 'Kero Kero Bonito',
      thumbnail_url: 'https://url',
      genre: 'Electric pop, Indie, Future Bass'
    },
    {
      id: 'a2',
      name: 'Nirvana',
      thumbnail_url: 'https://url',
      genre: 'Punk Rock, Grunge'
    },
    {
      id: 'a3',
      name: 'Playboi Carti',
      thumbnail_url: 'https://url',
      genre: 'Cloud rap, Trap, Hip-Hop/Rap'
    },
    {
      id: 'a4',
      name: 'Pixies',
      thumbnail_url: 'https://url',
      genre: 'Indie, Punk Rock, Grunge'
    }
  ],
  toggleFullList: false
}


export default ArtistList
