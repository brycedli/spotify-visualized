import React from 'react'
import { connect } from 'react-redux'
import { reportListToggleStatus, focusSong } from '../actions'
import PropTypes from 'prop-types'
import ExpandMore from '@material-ui/icons/ExpandMore';
import ExpandLess from '@material-ui/icons/ExpandLess';
import Song from './Song'


class SongList extends React.Component {
  constructor(props){
    super(props)
    this.state = {toggleFullList : props.toggleFullList}
    this.toggleList = this.toggleList.bind(this)
  }

  toggleList = ()=>{
    this.setState({toggleFullList:!this.state.toggleFullList})
    this.props.reportStatus(this.state.toggleFullList)
  }

  render() {
    const { songs, onHoverToFocusSongs } = this.props;
    const { toggleFullList } = this.state;
    return (
      <div className="listingpanel">
        <div>
          <h1 className="listings">Your Top Songs</h1>
        </div>
        <div 
        className={toggleFullList ? 'listings_max' : 'listings_min'}
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

        <div className='listToggle'>
          <div className='listToggleMask'></div>
          <div className='listToggleButton' onClick={this.toggleList} >
            <span className='listToggle'>
            {toggleFullList ? 'SEE LESS SONGS' : 'SEE MORE SONGS'}
            </span>
            <br />
            <span className='listToggle'>
            {toggleFullList ? <ExpandLess /> : <ExpandMore />}
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
  reportStatus: PropTypes.func.isRequired
}

SongList.defaultProps = {
  songs: [],
  toggleFullList: false
}

const mapStateToProps = (state) => {
  return {
    // toggleFullList: state.toggleFullList,
    songs: state.songs
  };
}

const mapDispatchToProps = dispatch => ({
  onHoverToFocusSongs: (id) => dispatch(focusSong(id)),
  reportStatus: (status) => dispatch(reportListToggleStatus('SONG',status))
})

export default connect(mapStateToProps ,mapDispatchToProps)(SongList) 

