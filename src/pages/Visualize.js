import { map } from "async";
import { Component, createElement } from "react";
import Grid from "@material-ui/core/Grid";
import Headers from '../components/Headers'
import * as THREE from "three";
import { connect } from 'react-redux'
import { addParticles } from '../actions'
import PropTypes from 'prop-types';
import {CONNECTION_URL, authenticateSpotify, getTopSongs, getPlaylistSongs} from '../middleware/SpotifyApi'
import ArtistList from '../components/ArtistList' 
import {OrbitControls, renderRequested} from '../libs/OrbitControls'

// var accessToken;
// var hash = {};
// var particles = new Map();
// window.location.hash.replace(/^#\/?/, '').split('&').forEach(function(kv) {
//     var spl = kv.indexOf('=');
//     if (spl !== -1) {
//         hash[kv.substring(0, spl)] = decodeURIComponent(kv.substring(spl+1));
//     }
    
// });
// var maxSongs = 400;

// console.log('initial hash', hash);
// if (hash.access_token){
//     // initializeThree();
//     accessToken = hash.access_token;

//     //var url = 'https://api.spotify.com/v1/me/tracks?time_range=short_term&limit=10';
//     var url = 'https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=10'
//     getTopSongs(url, function(){
//         getFeatures(function(){
//             console.log("done", particles);

//         });
//     });

//     function getFeatures(callback){
//         function analyzeTrack(accessToken, arr) {
//             var newArr = [];
//             //GET https://api.spotify.com/v1/audio-analysis/{id}
//             arr.forEach(function (item, index, array) {
//                 newArr.push(item.getTrackData().id);
//                 // console.log(item.getTrackData().id); 
//             });
//             var fullURL = 'https://api.spotify.com/v1/audio-features?ids=' + newArr.join(",");
//             // console.log(arr.join(","));
//             return fetch(fullURL, {
//                 method: 'GET',

//                 headers: {
//                     'Authorization': 'Bearer ' + accessToken,
//                 },

//             });

//         }
//         var mapArray = Array.from(particles.values());
//             requestTrackWrapper(0);
//             function requestTrackWrapper(index) {
//                 var maxedIndex = Math.min(index + 50, mapArray.length);
//                 analyzeTrack(accessToken, mapArray.slice(index, maxedIndex)).then((response) => {
//                     return response.json();
//                 }).then((data) => {
//                     setTimeout(function () {
//                         // loadingText.textContent = "analyzing " + maxedIndex + "/" +  mapArray.length + ' songs...';
//                         // loadingText.style.display = 'block';
//                         console.log("maxed:", maxedIndex, "index", index);
//                         if (data) {
//                             console.log(data);

//                             data.audio_features.forEach(function (item, index, array) {
//                                 if (item && item.id && particles.get(item.id)){
//                                     particles.get(item.id).addFeatureData(item);
//                                 }
//                             });
//                         } else {
//                             console.log("no data");
//                         }
//                         if (maxedIndex < mapArray.length){
//                             requestTrackWrapper(maxedIndex);

//                         }else{
//                             // loadingText.style.display = 'none';
//                             callback();
//                             // console.log("done");
//                             // renderData();
//                         }
//                     }, 5);

//                 });
//             }
//     }
//     function getTopSongs(url, callback){
        
//         fetch(url,{
//             method: 'GET',
//             headers:{
//                 'Authorization' : 'Bearer ' + accessToken,
//             },
    
//         }).then((response)=>{
//             return response.json();
//         }).then((data)=> {
//             console.log(data);

//             data.items.forEach(function(item, index, array) {
//                 var particle = new Particle();
//                 particle.addTrackData(item);
//                 // console.log(item.track.name, item.track.artists[0].name);
//                 if(!item){
//                     console.log("item not found in initial song loop");
//                 }

//                 if (!particles.get(item.id)) {
//                     particles.set(item.id, particle);
    
//                 } else {
//                     console.log("Duplicate item, skipping");
//                 }
                

//             })
//             console.log(data.next, data.offset);
//             //update view
//             //updateFunction

//             // if (maxSongs > particles.size){
//             //     getTopSongs(data.next, callback);

//             // }
//             if (data.next) {

//                 getTopSongs(data.next, callback);
//             } 
//             else {
//                 callback();
//             }
//         });
//     }
    
// }
// class Particle {
//     // trackData;
//     // featureData;
//     addTrackData(trackData) {
//         this.trackData = trackData;
//     };

//     addFeatureData(featureData) {
//         this.featureData = featureData;
//     };
//     getTrackData(trackData) {
//         return this.trackData;
//     };
//     getFeatureData(featureData) {
//         return this.featureData;
//     };

// }

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
    //do particle addition logic here, otherwise render.
    //1. create new sphere , set pos and size, color
    //2. create new 3d text, set anchor,size,content
    //3. this.renderer.add sphere and text
    // console.log(particle.trackData);
    const pop = particle.trackData.popularity;
    const size = particle.trackData.popularity/30;
    var geometry = new THREE.SphereGeometry(size, Math.ceil(pop/20 + 5), Math.ceil(pop/20 + 5));
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
    console.log(this.props.particles);
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
    if (!authenticateSpotify(window.location)) {
      window.location = '/';
      return;
    } else {
      //window.location = '#ready';
    }
    let _this = this;
    getTopSongs(function(data_particles){
      // console.log('particles',data_particles, _particles.size);
      
      data_particles.forEach(function(value, key) {
        _particles.set(key, value);
        _this.renderParticle(value);
      })

      
        // getFeatures(function(){
        //     console.log("done", particles);

        // });
    });
    getPlaylistSongs(function(data_particles){
      data_particles.forEach(function(value, key) {
        _particles.set(key, value);
        _this.renderValue(value);
      })
    })

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
          <Grid item sm={9} xs={12}>
            <div className="visualView"
              ref={mount => { this.renderRef.mount = mount}}
            >

            </div>
          </Grid>
          <Grid item sm={3} xs={12}>
            <ul className="listings">
              <li><ArtistList/></li>  
              <li>Song List</li>  
            </ul>
          </Grid>
        </Grid>

      </div>
    )
  }
}
// console.log("creating component")
// const objType = createElement(ThreeJsComponent,{ name:"nnamdi" });
// objType.handleUpdate();
// var threeCompRef;
// export default function VisualizePage(){
//     return(
//         <div>
//             <p>
//                 Visualize stuff here
//             </p>
//             <ThreeJsComponent/>
//             {/* <ThreeJsComponent ref={this.threeCompRef}/> */}
//         </div>
//     )
// }


const mapStateToProps = (state) => {
  console.log(state.particles);
  return {
    particles: state.particles
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
