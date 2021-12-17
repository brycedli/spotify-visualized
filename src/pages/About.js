import { Component, createElement } from "react";
import Grid from "@material-ui/core/Grid";
import Headers from '../components/Headers'


class About extends Component {

  render(){    
    return (
      <div className="dark_mode">

        <Grid container spacing={0}  className="app_header">
          <Grid item sm={6}  xs={12} >
          <a href="/"><h1 className="app_header">Your Spotify Musicscape</h1></a>
          </Grid>
          <Grid item sm={6}  xs={12}>
            <Headers />
          </Grid>
        </Grid>
        <Grid container spacing={0}  className="app_header">
          <Grid item >
            <div className="about_text">
                <h1 className="about_text">About this project</h1>
                <p className="about_text">
                Musicscape is a project that visualizes your music tastes according to how Spotify internally understands your favorite songs. Individual songs in this visualization are positioned by abstract attributes such as valence (mood), acousticness (the amount of acoustic  vs. synthetic instruments), and energy. You can also explore your top tastes in artists and songs by hovering over them.                  
                </p>
                <p className="about_text">
                Musicscape is the latest iteration of Spotify Visualized, which is hosted on brycedemos.com.
                </p>
                <p className="about_text">
                  Questions? Suggestions? Reach me at <a className="about_text" style={{color:'white',textDecoration:'underline'}} href="https://www.instagram.com/designbybryce/">@designbybryce</a> or check out my website at <a className="about_text" style={{color:'white',textDecoration:'underline'}} href="https://www.designbybryce.com">designbybryce.com</a>
                </p>
            </div>
          </Grid>
        </Grid>

      </div>
    )
  }
}

export default About 
