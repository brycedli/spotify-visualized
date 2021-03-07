import React from 'react'
import { connect } from 'react-redux'
import { expendList, focusSong } from '../actions'
import PropTypes from 'prop-types'
import ExpandMore from '@material-ui/icons/ExpandMore';
import Song from './Song'


class SongList extends React.Component {

  render() {
    const { songs, toggleFullList, onHoverToFocusSongs, onClickToExpend } = this.props;

    return (
      <div className="listingpanel">
        <div>
          <h1 className="listings">Your Top Songs</h1>
        </div>
        <div 
        className={toggleFullList ? 'listings_max' : 'listings_min'
        }
        >
          <ul className="listings">
            {songs.map(song =>
              <Song
                key={song.id}
                {...song}
                onHoverToFocusSongs={() => onHoverToFocusSongs(song.id)}
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
              SEE MORE SONGS
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

SongList.propTypes = {
  songs: PropTypes.array.isRequired,
  toggleFullList: PropTypes.bool.isRequired,
  onHoverToFocusSongs: PropTypes.func.isRequired,
  onClickToExpend: PropTypes.func.isRequired
}

SongList.defaultProps = {
  songs: [],
  toggleFullList: false
}

const mapStateToProps = (state) => {
  // console.log(state);
  return {
    toggleFullList: state.expendList == 'SONG',
    songs: state.songs
  };
}

const mapDispatchToProps = dispatch => ({
  onHoverToFocusSongs: (id) => dispatch(focusSong(id)),
  onClickToExpend: () => dispatch(expendList('SONG'))
})

export default connect(mapStateToProps ,mapDispatchToProps)(SongList) 

