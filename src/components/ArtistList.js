import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { expendList } from '../actions'
import PropTypes from 'prop-types'
import ExpandMore from '@material-ui/icons/ExpandMore';
import Artist from './Artist'


class ArtistList extends React.Component {

  render() {
    const { artists, toggleFullList } = this.props;

    return (
      <div className="listingpanel">
        <div>
          <h1 className="listings">Your Top Artists</h1>
        </div>
        <div 
        className={toggleFullList ? 'listings_max' : 'listings_min'
        }>
          <ul className="listings">
            {artists.map(artist =>
              <Artist
                key={artist.id}
                {...artist}
                // onClick={() => toggleFullList()}
              />
            )}
          </ul>
        </div>

        <div className='listSeeMore'>
          <div className='listSeeMoreMask'></div>
          <div className='listSeeMoreButton'
          onClick={e => {
            console.log("Clicked");
            this.props.dispatch(expendList('ARTIST'));
            }}
          >
            <span className='listSeeMore'>
              SEE MORE ARTISTS
            </span>
            <br />
            <span className='listSeeMore'>
              <ExpandMore />
            </span>
          </div>
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
      thumbnail_url: 'https://material-ui.com/static/images/avatar/1.jpg',
      genre: 'Electric pop, Indie, Future Bass'
    },
    {
      id: 'a2',
      name: 'Nirvana',
      thumbnail_url: 'https://material-ui.com/static/images/avatar/2.jpg',
      genre: 'Punk Rock, Grunge'
    },
    {
      id: 'a3',
      name: 'Playboi Carti',
      thumbnail_url: 'https://material-ui.com/static/images/avatar/3.jpg',
      genre: 'Cloud rap, Trap, Hip-Hop/Rap'
    },
    {
      id: 'a4',
      name: 'Pixies',
      thumbnail_url: 'https://material-ui.com/static/images/avatar/4.jpg',
      genre: 'Indie, Punk Rock, Grunge'
    },
    {
      id: 'a5',
      name: 'Kero Kero Bonito',
      thumbnail_url: 'https://material-ui.com/static/images/avatar/1.jpg',
      genre: 'Electric pop, Indie, Future Bass'
    },
    {
      id: 'a6',
      name: 'Nirvana',
      thumbnail_url: 'https://material-ui.com/static/images/avatar/2.jpg',
      genre: 'Punk Rock, Grunge'
    },
    {
      id: 'a7',
      name: 'Playboi Carti',
      thumbnail_url: 'https://material-ui.com/static/images/avatar/3.jpg',
      genre: 'Cloud rap, Trap, Hip-Hop/Rap'
    },
    {
      id: 'a8',
      name: 'Pixies',
      thumbnail_url: 'https://material-ui.com/static/images/avatar/4.jpg',
      genre: 'Indie, Punk Rock, Grunge'
    }
  ],
  toggleFullList: true
}

const mapStateToProps = (state) => {
  console.log('state',state);
  return {
    toggleFullList: state.expendList == 'ARTIST' || state.expendList == null,
    artists: state.artists
  };
}

// const mapDispatchToProps = dispatch => {
//   console.log('mapDispatchToProps called');
//   return {
//     expendList: toggleFullList => dispatch(toggleFullList?'ARTIST':'')
//   };
// }

export default connect(mapStateToProps /*,mapDispatchToProps*/)(ArtistList) 
