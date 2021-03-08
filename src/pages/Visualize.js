import { map } from "async";
import { Component, createElement } from "react";
import Grid from "@material-ui/core/Grid";
import Headers from '../components/Headers'
import * as THREE from "three";
import { connect } from 'react-redux'
import { addArtists, addSongs, focusSongs, focusArtist } from '../actions'
import PropTypes from 'prop-types';
import {CONNECTION_URL, authenticateSpotify, getTopSongs, getPlaylistSongs, getArtists, getTopArtists} from '../middleware/SpotifyApi'
import ArtistList from '../components/ArtistList' 
import SongList from '../components/SongList' 

import {OrbitControls, renderRequested} from '../libs/OrbitControls'
import {extractSongFromParticle} from '../middleware/VisualizationModels'

import {minimize_exec} from '../libs/util'

//https://fonts.google.com/specimen/Titillium+Web?preview.text_type=custom
//https://gero3.github.io/facetype.js/

const RESET_LOCATION_AFTER_OAUTH = process.env.REACT_APP_RESET_LOCATION_AFTER_OAUTH == 'true';
var lableFont = null
new THREE.FontLoader().load( '/fonts/Titillium Web_Bold.json', function ( font ) {
  lableFont = font;
})

const labelBaseScale = 0.01;

class ThreeJsComponent extends Component {

  constructor (props){
    super(props);
    this.particles = new Map();
    this.particleRenders = new Map();
    this.particleLabelRenders = new Map();
    
    
    this.artists = new Map();
    this.songs = new Map();

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
    this.resetFocus = this.resetFocus.bind(this);
    this.addLabel = this.addLabel.bind(this);
    this.makeLabelCanvas = this.makeLabelCanvas.bind(this);
    this.addHelperLabel = this.addHelperLabel.bind(this);
    const _this_renderRef = this.renderRef;
    const _this_updateRenderer = this.updateRenderer(_this_renderRef);
  
    window.addEventListener('resize', minimize_exec(_this_updateRenderer, 200));

  }

  // focusObject(songId) {
  //   const mesh = this.particleRenders.get(songId);
  //   const particle = this.particles.get(songId);
  //   const _this_renderRef = this.renderRef;
  //   let annimationFrames = 10;
  //   const wait = ms => new Promise((resolve) => setTimeout(resolve, ms));

  //   if (lableFont == null){
  //     return;
  //   }
  //   const _text_geometry = new THREE.TextGeometry( particle.trackData.name, {
  //     font: lableFont,
  //     size: 12,
  //     height: 1,
  //     curveSegments: 48,
  //     bevelEnabled: false
  //   } );


  //   const material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, transparent: true, opacity: 0.5, color: new THREE.Color(0.8, 0.8, 0.8) });
  //   const textMesh = new THREE.Mesh( _text_geometry, material );
  //   textMesh.position.x = mesh.position.x;
  //   textMesh.position.y = mesh.position.y + 10;
  //   textMesh.position.z = mesh.position.z;
  //   textMesh.scale.x = 0.5;
  //   textMesh.scale.y = 0.5;
  //   textMesh.scale.z = 0.5;
  //   textMesh.quaternion.copy(_this_renderRef.camera.quaternion);

  //   _this_renderRef.scene.add(textMesh);

  //   var mainLoop = async() => {
  //     if (annimationFrames > 0) {
  //       annimationFrames -= 1;
  //       await wait(100);
  //       requestAnimationFrame(mainLoop)
  //     } else {
  //       mesh.scale.x = 0.2;
  //       mesh.scale.y = 0.2;
  //       mesh.scale.z = 0.2;
  //       _this_renderRef.scene.remove(textMesh);
  //     }
      
  //     _this_renderRef.renderer.render(_this_renderRef.scene, _this_renderRef.camera)
      
  //     mesh.scale.x += 0.1
  //     mesh.scale.y += 0.1
  //     mesh.scale.z += 0.1
  //   }
    
  //   mainLoop()

  // }


  focusObjects(songIdMap) {

    this.particleRenders.forEach((song,id)=>{
      if (songIdMap.has(id)) {
        console.log('focus song', song, id);
        //song.visible = true;
        song.material.opacity = 1; 
      } else {
        //song.visible = false;
        song.material.opacity = 0.1; 
      }
      
    });
    this.particleLabelRenders.forEach((label,id)=>{
      if (songIdMap.has(id)) {
        console.log('focus label', label, id);
        //song.visible = true;
        label.material.opacity = 1; 
        label.scale.x = label.userData.prefScaleW * 3;
        label.scale.y = label.userData.prefScaleH * 3;

      } else {
        //song.visible = false;
        label.material.opacity = 0.1; 
      }
      
    });
    

    this.renderRef.renderer.render(this.renderRef.scene, this.renderRef.camera);

  }

  resetFocus(){
    console.log('reset focus');
    this.particleRenders.forEach((song,id)=>{
      //song.visible = true;
      song.material.opacity = 1; 
    });
    this.particleLabelRenders.forEach((label,id)=>{
      //label.visible = true;
      label.material.opacity = 1; 
      label.scale.x = label.userData.prefScaleW;
      label.scale.y = label.userData.prefScaleH;
    });
    

    this.renderRef.renderer.render(this.renderRef.scene, this.renderRef.camera);
  }
  focusSong(songId) {
    // console.log('focus song', songId, 'mesh',this.particleRenders.get(songId), 'particle',this.particles.get(songId));
    const objectMap = new Map();
    objectMap.set(songId, this.particleRenders.get(songId));
    this.focusObjects(objectMap);
  }

  focusArtist(artisId) {
    if (this.artists.get(artisId) == undefined || this.artists.get(artisId) == null) {
      console.log('no song found for artist', artisId);
      return;
    }
    
    console.log('focus artist', artisId, 'songs', this.artists.get(artisId).get('songs'));
    this.focusObjects(this.artists.get(artisId).get('songs'));
  }

  componentDidUpdate(preProp) {

    if (preProp.focusArtist !== this.props.focusArtist) {
      this.focusArtist(this.props.focusArtist);
    }
    if (preProp.focusSong !== this.props.focusSong) {
      this.focusSong(this.props.focusSong);
    }
  }

  addHelperLabel (content, labelGeometry){
    const canvas = this.makeLabelCanvas(32, content);
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

  makeLabelCanvas(size, name) {
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

    // need to set font again after resizing canvas
    ctx.font = font;
    ctx.textBaseline = 'top';
    // ctx.textAlign = 'center';
    // ctx.imageSmoothingEnabled = true;
    // ctx.fillStyle = 'blue';
    // ctx.fillRect(0, 0, width, height);

    // scale to fit but don't stretch
    // const scaleFactor = Math.min(1, baseWidth / textWidth);
    // ctx.translate(0, height / 2);
    // ctx.scale(scaleFactor, 1);
    
    ctx.fillStyle = 'white';
    ctx.fillText(name, borderSize, borderSize);
    
    return ctx.canvas;
  }

  addLabel(content, position, distance , size) {
    const canvas = this.makeLabelCanvas(size, content);
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;

    const labelMaterial = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthTest: false,
    });
    const label = new THREE.Sprite(labelMaterial);
    label.userData = { prefScaleW: canvas.width  * labelBaseScale, prefScaleH: canvas.height * labelBaseScale };

    label.scale.x = canvas.width * labelBaseScale;
    label.scale.y = canvas.height * labelBaseScale;
    label.position.x = position.x;
    label.position.y = position.y - distance - 1;
    label.position.z = position.z;

    return label;
  }

  renderParticle(particle){

    const pop = particle.trackData.popularity + 1;
    const size = particle.trackData.popularity/30;
    var geometry = new THREE.SphereGeometry(size, 10, 10);
    if (!particle.featureData){
      return;
    }

    var col = new THREE.Color(particle.featureData.energy, particle.featureData.valence, particle.featureData.acousticness);

    var material = new THREE.MeshBasicMaterial({ color: col });
    material.transparent = true;
    var song = new THREE.Mesh(geometry, material);
    song.position.x = particle.featureData.energy * 100;
    song.position.y = particle.featureData.valence * 100;
    song.position.z = particle.featureData.acousticness * 100;
    this.particleRenders.set(particle.trackData.id, song);
    this.renderRef.scene.add(song);
    this.renderRef.controls.update();
  
    var label = this.addLabel(particle.trackData.name, song.position, particle.trackData.popularity/30, size*64);
    this.renderRef.scene.add(label);
    this.particleLabelRenders.set(particle.trackData.id, label);
    
    this.renderRef.renderer.render(this.renderRef.scene, this.renderRef.camera);
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
    const _particleRenders = this.particleRenders;
    const _artists = this.artists;
    const _songs = this.songs;
    const _dispatch = this.props.dispatch;
    const artistToDisplay = new Map();
    const songsToDisplay = new Map();
    
    if (!authenticateSpotify(window.location)) {
      window.location = '/';
      return;
    } else if (RESET_LOCATION_AFTER_OAUTH){
      window.location = '#ready';
    }

    const max_artist = 20;
    let _this = this;

    //get top songs then artists
    getTopSongs(function(data_particles , hasNext){
      console.log('top songs',data_particles, _particles.size, 'hasNext',hasNext);
      const songBatch = [];
      data_particles.forEach(function(value, key) {
        if(_particles.get(key) != null){
          return;
        }
        if (value.trackData != null && value.trackData.artists != null) {
          value.trackData.artists.forEach(a =>{
            //console.log(a);
            if (!_artists.has(a.id)) {
              const _newArtist = new Map();
              _newArtist.set('name',a.name);
              _newArtist.set('songs',new Map());
              _artists.set(a.id, _newArtist);
            } 
            _artists.get(a.id).get('songs').set(value.trackData.id, value.trackData);
          });
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
      
      if (hasNext) {
        return;
      }
      //then get artists
      console.log("Get Top artists:");
      getTopArtists((artistdata)=>{
        const artistBatch = [];
        let artistIds = [];
        console.log("Top artists:" , artistdata);
        if (artistdata.length > 0) {
          artistdata.forEach(a=>{
            if (a.id == null || a.id == '') {
              return;
            }
            const item = {id:a.id,name:a.name,thumbnail_url:a.images[2].url,genre:a.genres.join(', ')};
            if (!artistToDisplay.has(a.id)) {
              // if (_artists.has(a.id)) {
              //   const songs = Array.from(_artists.get(a.id).get('songs').keys());
              //   item['songs'] = songs;
              // } else {
              //   item['songs'] = [];
              // }
              artistToDisplay.set(a.id,item);
              artistBatch.push(item);
              //todo: add song id list
              //_dispatch(addArtists(item));
            } 
            
            if (artistIds.length < max_artist) {
              artistIds.push(a.id);
            }
          });
          
        } else {
            //use existing artist list
            _artists.forEach((v,k)=>{
              if (artistIds.length < max_artist) {
                artistIds.push(k);
              }
            });
        }

        if (artistIds.length > 0) {
          getArtists((artistdata)=>{
            //console.log("artists from list:" , artistIds);
            const artistBatch = [];
            artistdata.forEach(a=>{
              if (a.id == null || a.id == '') {
                return;
              }
              const item = {id:a.id,name:a.name,thumbnail_url:a.images[2].url,genre:a.genres.join(', ')};
              if (!artistToDisplay.has(a.id)) {
                if (_artists.has(a.id)) {
                  const songs = Array.from(_artists.get(a.id).get('songs').keys());
                  item['songs'] = songs;
                } else {
                  item['songs'] = [];
                }
                artistToDisplay.set(a.id,item);
                artistBatch.push(item);
                // _dispatch(addArtists(item));
              } 
  
            });
            _dispatch(addArtists(artistBatch));

            // // get some songs from playlists
            // getPlaylistSongs(function(data_particles){
            //   const songBatch = [];
            //   //console.log(data_particles);
            //   data_particles.forEach(function(value, key) {
            //     if(_particles.get(key) != null){
            //       return;
            //     }
            //     _particles.set(key, value);
            //     _this.renderParticle(value);
            //     const item = extractSongFromParticle(value);
            //     if (item!=null && !songsToDisplay.has(item.id)) {
            //       songsToDisplay.set(item.id,item);
            //       songBatch.push(item);
            //     } 

            //     if (value.trackData != null && value.trackData.artists != null) {
            //       value.trackData.artists.forEach(a =>{
            //           //console.log(a);
            //           if (!_artists.has(a.id)) {
            //             const _newArtist = new Map();
            //             _newArtist.set('name',a.name);
            //             _newArtist.set('songs',new Map());
            //             _artists.set(a.id, _newArtist);
            //           } 
            //           _artists.get(a.id).get('songs').set(value.trackData.id, value.trackData);
            //         });
            //     }
            //   });
            //   if (songBatch.length > 0) {
            //     _dispatch(addSongs(songBatch));
            //   }
            // });

          }, artistIds);
        }
        _dispatch(addArtists(artistBatch));
      });

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

    // function makeLabelCanvas(size, name) {
    //   const borderSize = 2;
    //   const ctx = document.createElement('canvas').getContext('2d');
    //   const font = `${size}px Arial`;
    //   ctx.font = font;
    //   // measure how long the name will be
    //   const doubleBorderSize = borderSize * 2;
    //   const width = ctx.measureText(name).width + doubleBorderSize;
    //   const height = size + doubleBorderSize;
    //   ctx.canvas.width = width;
    //   ctx.canvas.height = height;
    //   ctx.font = font;
    //   ctx.textBaseline = 'middle';
    //   ctx.translate(0, height / 2);      
    //   ctx.fillStyle = 'white';
    //   ctx.fillText(name, borderSize, borderSize);
      
    //   return ctx.canvas;
    // }

    

    let xLabel = this.addHelperLabel("0 ⟵energy⟶ 100", labelGeometry);
    xLabel.position.x = 50;
    xLabel.position.y = 10;
    xLabel.position.z = 100;
    this.renderRef.scene.add(xLabel);

    let yLabel = this.addHelperLabel("0 ⟵valence⟶ 100",labelGeometry);
    yLabel.position.x = 10;
    yLabel.position.y = 50;
    yLabel.rotation.z = 3.141/2;
    this.renderRef.scene.add(yLabel);

    let zLabel = this.addHelperLabel("100 ⟵acousticness⟶ 0",labelGeometry);
    zLabel.position.x = 0;
    zLabel.position.y = 10;
    zLabel.position.z = 50;
    zLabel.rotation.y = 3.141/2;
    this.renderRef.scene.add(zLabel);

    
    let xLabelBack = this.addHelperLabel("100 ⟵energy⟶ 0",labelGeometry);
    xLabelBack.position.x = 50;
    xLabelBack.position.y = 10;
    xLabelBack.position.z = 100;
    xLabelBack.rotation.y = -3.141;
    this.renderRef.scene.add(xLabelBack);

    let yLabelBack = this.addHelperLabel("0 ⟵valence⟶ 100",labelGeometry);
    yLabelBack.position.x = 10;
    yLabelBack.position.y = 50;
    yLabelBack.rotation.x = -3.141;
    yLabelBack.rotation.z = -3.141/2;

    this.renderRef.scene.add(yLabelBack);

    let zLabelBack = this.addHelperLabel("0 ⟵acousticness⟶ 100",labelGeometry);
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
            <div className="listpanelcontainer"
            onMouseLeave={this.resetFocus}
            >
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
  //console.log('highlight song:',state.focusSong, 'artist',state.focusArtist);
  return {
    focusArtist: state.focusArtist,
    focusSong: state.focusSong
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
