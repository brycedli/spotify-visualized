import { map } from "async";
import { Component, createElement } from "react";
import Grid from "@material-ui/core/Grid";
import Headers from '../components/Headers'
import * as THREE from "three";
import { connect } from 'react-redux'
import { addArtists, addSongs, focusSongs } from '../actions'
import PropTypes from 'prop-types';
import {CONNECTION_URL, authenticateSpotify, getTopSongs, getPlaylistSongs, getArtists} from '../middleware/SpotifyApi'
import ArtistList from '../components/ArtistList' 
import SongList from '../components/SongList' 

import {OrbitControls, renderRequested} from '../libs/OrbitControls'
import {extractSongFromParticle} from '../middleware/VisualizationModels'

function minimize_exec(fn, ms) {
  let timer
  return _ => {
    clearTimeout(timer)
    timer = setTimeout(_ => {
      timer = null
      fn.apply(this, arguments)
    }, ms)
  };
}

class ThreeJsComponent extends Component {

  constructor (props){
    super(props);
    this.particles = new Map();
    this.artists = new Map();
    this.songs = new Map();
    console.log("particles map created", this.particles);

    this.renderRef = {
      renderRequested:false,
      controls: null,
      renderer: null,
      scene: null, 
      camera: null, 
      mount: null,
      resizeRendererToDisplaySize:  (_this_renderer, _this_mount) => {
        if (_this_mount == null) {
          return;
        }
        const _canvas = _this_renderer.domElement;
        const _width = _this_mount.clientWidth;
        const _height = _this_mount.clientHeight;
        const _style_width = _this_mount.style.width;
        const _style_height = _this_mount.style.height;
        const needCanvasResize = _canvas.width !== _width || _canvas.height !== _height;
        const needStyleResize = _canvas.style.width !== _style_width || _canvas.style.height !== _style_height;
        
        //console.log('canvas',_canvas, 'mount', _width,_height,'needResize(canvas,style)',needCanvasResize,needStyleResize);
        if (needCanvasResize) {
          _this_renderer.setSize(_width, _height, false);
        }

        if (needStyleResize) {
          _canvas.style.width = _style_width;
          _canvas.style.height = _style_height;
        }
        return needCanvasResize;
      }
    };
    const _this_renderRef = this.renderRef;
    const _this_updateRenderer = this.updateRenderer(_this_renderRef);
    window.addEventListener('resize', minimize_exec(_this_updateRenderer, 200));

  }

  componentDidUpdate(preProp) {
    console.log('updated');
    this.handleUpdate();
  }

  renderParticle(particle){
    //console.log("prop particles");

    // let _particles = this.props.particles;
    // if(!_particles.get(particle.trackData.id)){
    //   this.props.particles.set(particle.trackData.id, particle);
    // }else{
    //   console.log("duplicate");
    //   return;
    // }
    // console.log(this.props.particles.length);
    //do particle addition logic here, otherwise render.
    //1. create new sphere , set pos and size, color
    //2. create new 3d text, set anchor,size,content
    //3. this.renderer.add sphere and text
    // console.log(particle.trackData);
    const pop = particle.trackData.popularity + 1;
    const size = particle.trackData.popularity/30;
    var geometry = new THREE.SphereGeometry(1, 10, 10);
    if (!particle.featureData){
      // console.log("no feature data, ",particle);
      return;
    }

    var col = new THREE.Color(particle.featureData.energy, particle.featureData.valence, particle.featureData.acousticness);

    var material = new THREE.MeshBasicMaterial({ color: col });
    var song = new THREE.Mesh(geometry, material);
    song.position.x = particle.featureData.energy * 100;
    song.position.y = particle.featureData.valence * 100;
    song.position.z = particle.featureData.acousticness * 100;

    this.renderRef.scene.add(song);
    this.renderRef.controls.update();
  
    this.renderRef.renderer.render(this.renderRef.scene, this.renderRef.camera);
  }


  
  handleUpdate(){
    console.log(`render particle ${this.props.particles} in Visualize`);
    const currentState = [];
    // console.log(this.particles);
    for (const p in this.props.particles){
      console.log(p);
      this.renderParticle(p);
      this.particles.push(p);
    }
    
    this.renderer.render(this.scene, this.camera);
    console.log('rendered', this.particles);
    //https://github.com/brycedli/spotify-visualized/blob/aa9485c2b8b2a4f60869ac57ae89cd051da053bb/django-spotify/spotme/templates/spotme/visualize.html#L470
    console.log("rendered");
  }

  requestRenderIfNotRequested() {
    let _this_renderRef = this.renderRef;
    let _this_updateRenderer = this.updateRenderer(_this_renderRef);
    return () => {
      //console.log ("renderRequested", _this_renderRef.renderRequested);
      if (!_this_renderRef.renderRequested) {
        _this_renderRef.renderRequested = true;
        requestAnimationFrame(_this_updateRenderer);
      }
    }
    
  }
  updateRenderer(
    _this_renderRef
    ) {

    return ()=> {
      // console.log(_this_renderRef.camera.position);
      // console.log("rendered", _this_renderRequested);
      _this_renderRef.renderRequested = false;

      if (_this_renderRef.resizeRendererToDisplaySize(_this_renderRef.renderer,_this_renderRef.mount )) {
        const canvas = _this_renderRef.renderer.domElement;
        _this_renderRef.camera.aspect = canvas.clientWidth / canvas.clientHeight;
        _this_renderRef.camera.updateProjectionMatrix();
    }
    _this_renderRef.controls.update();
  
    _this_renderRef.renderer.render(_this_renderRef.scene, _this_renderRef.camera);

    }


}
  componentDidMount(){
    //handle login redirect
    const _particles = this.particles;
    const _artists = this.artists;
    const _songs = this.songs;
    const _dispatch = this.props.dispatch;
    const artistToDisplay = new Map();
    const songsToDisplay = new Map();
    
    if (!authenticateSpotify(window.location)) {
      window.location = '/';
      return;
    } else {
      //window.location = '#ready';
    }

    const max_artist = 20;
    let _this = this;
    getTopSongs(function(data_particles){
      console.log('top songs',data_particles, _particles.size);
      const songBatch = [];
      data_particles.forEach(function(value, key) {
        if(_particles.get(key) != null){
          //console.log("skipped");
          return;
        }
        _particles.set(key, value);
        _this.renderParticle(value);
        //get feature content
        const item = extractSongFromParticle(value);
        if (item!=null && !songsToDisplay.has(item.id)) {
          songsToDisplay.set(item.id,item);
          songBatch.push(item);
        } 
      })
      if (songBatch.length > 0) {
        _dispatch(addSongs(songBatch));
      }
      
    });

    getPlaylistSongs(function(data_particles){
      let artistIds = [];
      const songBatch = [];
      console.log(data_particles);
      data_particles.forEach(function(value, key) {
        if(_particles.get(key) != null){
          console.log("skipped");
          return;
        }
        _particles.set(key, value);
        _this.renderParticle(value);
        const item = extractSongFromParticle(value);
        if (item!=null && !songsToDisplay.has(item.id)) {
          songsToDisplay.set(item.id,item);
          songBatch.push(item);
        } 

        if (value.trackData != null && value.trackData.artists != null) {
          value.trackData.artists.forEach(a =>{
              _artists[a.id] = {id:a.id,name:a.name,thumbnail_url:a.url,genre:a.type};
              if (artistIds.length < max_artist) {
                artistIds.push(a.id);
              }
            });
        }
        //console.log('value.trackData',value.trackData);
      });
      if (songBatch.length > 0) {
        _dispatch(addSongs(songBatch));
      }
      

      //console.log( 'artistIds', artistIds);
      //get top artist _artists
      
      if (artistIds.length > 0) {
        getArtists((artistdata)=>{
          const artistBatch = [];
          artistdata.forEach(a=>{
            if (a.id == null || a.id == '') {
              return;
            }
            const item = {id:a.id,name:a.name,thumbnail_url:a.images[2].url,genre:a.genres.join(', ')};
            if (!artistToDisplay.has(a.id)) {
              artistToDisplay.set(a.id,item);
              artistBatch.push(item);
              //_dispatch(addArtists(item));
            } 

          });
          _dispatch(addArtists(artistBatch));
        }, artistIds);
      }

    });

    this.renderRef.scene = new THREE.Scene();
    this.renderRef.camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);

    this.renderRef.renderer = new THREE.WebGLRenderer();
    this.renderRef.renderer.setSize(window.innerWidth, window.innerHeight);

    // console.log(this.renderRef.mount);
    this.renderRef.mount.style.height = window.height - 200;
    this.renderRef.mount.appendChild(this.renderRef.renderer.domElement);

    let initDist = 250;
    this.renderRef.camera.position.x = 340;
    this.renderRef.camera.position.y = 180;
    this.renderRef.camera.position.z = 180;
    this.renderRef.camera.lookAt(new THREE.Vector3(50,50,50));

    this.renderRef.controls = new OrbitControls(this.renderRef.camera, this.renderRef.renderer.domElement);
    this.renderRef.controls.zoomSpeed = 0.5;
    this.renderRef.controls.target.set(50, 50, 50);
    this.renderRef.controls.update();

    this.renderRef.controls.addEventListener('change', this.requestRenderIfNotRequested());
    this.renderRef.controls.enableDamping = true;
    this.renderRef.renderRequested = false;

    //this.updateRenderer(this.renderRef);
    this.requestRenderIfNotRequested()();
    // console.log(this.renderRef.controls);

    var boxMesh = new THREE.Mesh(new THREE.BoxBufferGeometry(100, 100, 100));
    boxMesh.position.x = 50;
    boxMesh.position.y = 50;
    boxMesh.position.z = 50;
    var helper = new THREE.BoxHelper(boxMesh);
    helper.material.color.setHex(0xFFFFFF);
    helper.material.blending = THREE.AdditiveBlending;
    helper.material.transparent = true;


    this.renderRef.scene.add(helper);

    // var geometry = new THREE.BoxGeometry(1, 1, 1);
    // var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    // var cube = new THREE.Mesh(geometry, material);
    // this.renderRef.scene.add(cube);
    const labelGeometry = new THREE.PlaneBufferGeometry(1, 1);

    function makeLabelCanvas(size, name) {
      const borderSize = 2;
      const ctx = document.createElement('canvas').getContext('2d');
      const font = `${size}px Arial`;
      ctx.font = font;
      // measure how long the name will be
      const doubleBorderSize = borderSize * 2;
      const width = ctx.measureText(name).width + doubleBorderSize;
      const height = size + doubleBorderSize;
      ctx.canvas.width = width;
      ctx.canvas.height = height;
      ctx.font = font;
      ctx.textBaseline = 'middle';
      ctx.translate(0, height / 2);      
      ctx.fillStyle = 'white';
      ctx.fillText(name, borderSize, borderSize);
      
      return ctx.canvas;
    }

    function addHelperLabel (content){
      const canvas = makeLabelCanvas(32, content);
      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;

      const labelMaterial = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true
      });
      const label = new THREE.Mesh(labelGeometry, labelMaterial);
      const labelBaseScale = 0.1;
      label.scale.x = canvas.width * labelBaseScale;
      label.scale.y = canvas.height * labelBaseScale;

      return label;
    }

    let xLabel = addHelperLabel("0 ⟵energy⟶ 100");
    xLabel.position.x = 50;
    xLabel.position.y = 10;
    xLabel.position.z = 100;
    this.renderRef.scene.add(xLabel);

    let yLabel = addHelperLabel("0 ⟵valence⟶ 100");
    yLabel.position.x = 10;
    yLabel.position.y = 50;
    yLabel.rotation.z = 3.141/2;
    this.renderRef.scene.add(yLabel);

    let zLabel = addHelperLabel("100 ⟵acousticness⟶ 0");
    zLabel.position.x = 0;
    zLabel.position.y = 10;
    zLabel.position.z = 50;
    zLabel.rotation.y = 3.141/2;
    this.renderRef.scene.add(zLabel);

    
    let xLabelBack = addHelperLabel("100 ⟵energy⟶ 0");
    xLabelBack.position.x = 50;
    xLabelBack.position.y = 10;
    xLabelBack.position.z = 100;
    xLabelBack.rotation.y = -3.141;
    this.renderRef.scene.add(xLabelBack);

    let yLabelBack = addHelperLabel("0 ⟵valence⟶ 100");
    yLabelBack.position.x = 10;
    yLabelBack.position.y = 50;
    yLabelBack.rotation.x = -3.141;
    yLabelBack.rotation.z = -3.141/2;

    this.renderRef.scene.add(yLabelBack);

    let zLabelBack = addHelperLabel("0 ⟵acousticness⟶ 100");
    zLabelBack.position.x = 0;
    zLabelBack.position.y = 10;
    zLabelBack.position.z = 50;
    zLabelBack.rotation.y = -3.141/2;
    // zLabelBack.rotation.y = -3.141/2;

    this.renderRef.scene.add(zLabelBack);
    // this.renderRef.camera.position.z = 5;

    this.renderRef.renderer.render(this.renderRef.scene, this.renderRef.camera);
    var _this_renderRef = this.renderRef;
    // var animate = function () {
    //   requestAnimationFrame( animate );
      
    //   cube.rotation.x += 0.01;
    //   cube.rotation.y += 0.01;
    //   _this_renderRef.renderer.render( _this_renderRef.scene, _this_renderRef.camera );
    // };
    // animate();
  }

  render(){    
    return (
      <div className="dark_mode">

        <Grid container spacing={0} style={{padding: 33}}>
          <Grid item sm={6}  xs={12} >
            <h1 className="app_header">Your Spotify Musicscape</h1>
          </Grid>
          <Grid item sm={6}  xs={12}>
            <Headers />
          </Grid>
        </Grid>
        <Grid container spacing={0}>
          <Grid item >
            <div className="visualView"
              ref={mount => { this.renderRef.mount = mount}}
            >

            </div>
          </Grid>
          <Grid item >
            <div className="listpanelcontainer">
              <Grid container direction="column" spacing={0} style={{padding: 0}}>
                <Grid item >
                  <ArtistList/>
                </Grid>
                <Grid item >
                  <SongList/>
                </Grid>
              </Grid>
            </div>
            

            {/* <ul className="listings" >
              <li><ArtistList/></li>  
              <li><SongList/></li>  
            </ul> */}
          </Grid>
        </Grid>

      </div>
    )
  }
}


const mapStateToProps = (state) => {
  //console.log('highlight songs',state.focusSongs);
  return {
    focusSongs: state.focusSongs
  };
}

// const mapDispatchToProps = dispatch => {
//   console.log('mapDispatchToProps called');
//   return {
//     particles: partical => dispatch(partical)
//   };
// }

ThreeJsComponent.propTypes = {
  particles: PropTypes.array
}

export default connect(mapStateToProps /*,mapDispatchToProps*/)(ThreeJsComponent) 
