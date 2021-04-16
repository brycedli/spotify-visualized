import React from 'react'
import { connect } from 'react-redux'
import { reportListToggleStatus, focusArtist } from '../actions'
import PropTypes from 'prop-types'
import ExpandMore from '@material-ui/icons/ExpandMore';
import ExpandLess from '@material-ui/icons/ExpandLess';
import Artist from './Artist'


class ArtistList extends React.Component {

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
    const { artists, onHoverToFocusArtist } = this.props;
    const { toggleFullList } = this.state;

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

        <div className='listToggle'>
          <div className='listToggleMask'></div>
          <div className='listToggleButton' onClick={this.toggleList} >
            <span className='listToggle'>
            {toggleFullList ? 'SEE LESS ARTISTS' : 'SEE MORE ARTISTS'}
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

ArtistList.propTypes = {
  artists: PropTypes.array.isRequired,
  toggleFullList: PropTypes.bool.isRequired,
  onHoverToFocusArtist: PropTypes.func.isRequired,
  reportStatus: PropTypes.func.isRequired
}

ArtistList.defaultProps = {
  artists: [],
  toggleFullList: false
}

const mapStateToProps = (state) => {
  return {
    // toggleFullList: state.expendList == 'ARTIST', // || state.expendList == null,
    artists: state.artists
  };
}

const mapDispatchToProps = dispatch => ({
  onHoverToFocusArtist: (id) => dispatch(focusArtist(id)),
  reportStatus: (status) => dispatch(reportListToggleStatus('ARTIST',status))
})

export default connect(mapStateToProps, mapDispatchToProps)(ArtistList) 
