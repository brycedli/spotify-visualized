import { Component, createElement } from "react";
import Grid from "@material-ui/core/Grid";
import Headers from '../components/Headers'


class About extends Component {

  render(){    
    return (
      <div className="dark_mode">

        <Grid container spacing={0} style={{padding: 33}}>
          <Grid item sm={6}  xs={12} >
          <a href="/"><h1 className="app_header">Your Spotify Musicscape</h1></a>
          </Grid>
          <Grid item sm={6}  xs={12}>
            <Headers />
          </Grid>
        </Grid>
        <Grid container spacing={0} style={{padding: 33}}>
          <Grid item >
            <div className="about_text">
                <p className="about_text">About</p>
                <p className="about_text">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.laborum.Lorem
                </p>
            </div>
          </Grid>
        </Grid>

      </div>
    )
  }
}

export default About 
