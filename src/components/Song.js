import React from 'react'
import PropTypes from 'prop-types'
import Avatar from '@material-ui/core/Avatar';
import Grid from "@material-ui/core/Grid";


const Song = ({ id, name, thumbnail_url, genre }) => (
  <li
    // onClick={onClick}
    style={{
      // textDecoration: completed ? 'line-through' : 'none'
    }}
  >

    <Grid container spacing={0} wrap='nowrap' style={{padding: 0}}>
      <Grid item style={{padding: '7px 7px 7px 0px'}}>
      <Avatar alt={name} variant="square" src={thumbnail_url} />
      </Grid>
      <Grid item style={{padding: '7px 7px 7px 0px'}}>
      <h1 className="listitem">{name}</h1><h2 className="listitem">{genre}</h2>
      </Grid>
    </Grid>

     
  </li>
)

Song.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  thumbnail_url: PropTypes.string.isRequired,
  genre: PropTypes.string.isRequired
}

export default Song