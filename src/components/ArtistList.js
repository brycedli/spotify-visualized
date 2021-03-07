import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { expendList, focusArtist } from '../actions'
import PropTypes from 'prop-types'
import ExpandMore from '@material-ui/icons/ExpandMore';
import Artist from './Artist'


class ArtistList extends React.Component {

  render() {
    const { artists, toggleFullList , onClickToExpend, onHoverToFocusArtist} = this.props;

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
                onHoverToFocusArtist={() => onHoverToFocusArtist(artist.id)}
              />
            )}
          </ul>
        </div>

        <div className='listSeeMore'>
          <div className='listSeeMoreMask'></div>
          <div className={toggleFullList ? 'disableSeeMoreButton' : 'listSeeMoreButton' }
          onClick={onClickToExpend}
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
  toggleFullList: PropTypes.bool.isRequired,
  onHoverToFocusArtist: PropTypes.func.isRequired
}

ArtistList.defaultProps = {
  artists: [
  ],
  toggleFullList: true
}

const mapStateToProps = (state) => {
  //console.log('state',state);
  return {
    toggleFullList: state.expendList == 'ARTIST' || state.expendList == null,
    artists: state.artists
  };
}

const mapDispatchToProps = dispatch => ({
  onHoverToFocusArtist: (id) => dispatch(focusArtist(id)),
  onClickToExpend: () => dispatch(expendList('ARTIST'))
})

// const mapDispatchToProps = dispatch => {
//   console.log('mapDispatchToProps called');
//   return {
//     expendList: toggleFullList => dispatch(toggleFullList?'ARTIST':'')
//   };
// }

export default connect(mapStateToProps, mapDispatchToProps)(ArtistList) 
