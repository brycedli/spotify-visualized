import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import Grid from "@material-ui/core/Grid";

import {CONNECTION_URL, authenticateSpotify} from '../middleware/SpotifyApi'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

const Welcome = () => {
  const classes = useStyles();
  return (
  
    <div className="welcomePopup"
      style={{  
        backgroundImage: 'url(/welcome-bg.png)'
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs>
          
        </Grid>
        <Grid item xs={5}>
          <div id="menu_links">
            <a href="/contact">CONTACT</a> <a href="/about">ABOUT THIS PROJECT</a>
          </div>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs>
        </Grid>
        <Grid item xs={6}>
        <h1 className="welcome">
          Your Spotify Songscape 
          </h1>
          <p className="welcome">
          Songscape visualizes music attributes from your favorite songs. These attributes, such as valence (a measure of mood), acousticness, and energy, are plotted on three axises: creating a unique Songscape navigatable in three dimensions.
          </p>
          <p className="welcome">
          These song attributes are part of Spotify's recommendation algorithm. 
          </p>
          <p>
          <Button 
          style={{
            borderRadius: 50,
            backgroundColor: "#1DB954",
            padding: "10px 20px",
            fontSize: "14px",
            fontWeight: "bold",
            color: "white",
            marginTop: "33px"
        }}
          variant="contained" color="primary">CONNECT YOUR SPOTIFY</Button>
          </p>
        </Grid>
        <Grid item xs>
        </Grid>
      </Grid>
    </div>

)}

export default Welcome
