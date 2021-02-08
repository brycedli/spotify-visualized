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
  songs: [
    {
      id: 'a1',
      name: 'Trap Queen – Fetty Wap',
      thumbnail_url: 'https://i.scdn.co/image/89b92c6b59131776c0cd8e5df46301ffcf36ed69',
      genre: 'Energetic, synthetic, mildly positive'
    },
    {
      id: 'a2',
      name: 'Pumped Up Kicks – Foster the People',
      thumbnail_url: 'https://i.scdn.co/image/ab67616d00004851ea89f37b9674bbcdd355fdb1',
      genre: 'Strongly energetic, acoustic, mildly positive '
    },
    {
      id: 'a3',
      name: 'Playboi Carti',
      thumbnail_url: 'https://i.scdn.co/image/ab67616d000048517763c5c3004079c1bf46189e',
      genre: 'Cloud rap, Trap, Hip-Hop/Rap'
    },
    {
      id: 'a4',
      name: 'A Rush of Blood to the Head – Coldplay',
      thumbnail_url: 'https://i.scdn.co/image/ab67616d0000485132ddd18dc88969d84dbff3ab',
      genre: 'Relaxed, acoustic, mildly negative'
    },
    {
      id: 'a5',
      name: 'White Teeth Teens – Lorde',
      thumbnail_url: 'https://i.scdn.co/image/ab67616d00004851e21078039e2a0098fe318ec8',
      genre: 'Mildly relaxed, synthetic, negative'
    }
  ],
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

