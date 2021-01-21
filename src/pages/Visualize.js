import { map } from "async";
import { Component, createElement } from "react";
import * as THREE from "three";
import { connect } from 'react-redux'
import { addParticles } from '../actions'
import PropTypes from 'prop-types';
import {CONNECTION_URL, authenticateSpotify, getTopSongs} from '../middleware/SpotifyApi'

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
class Particle {
    // trackData;
    // featureData;
    addTrackData(trackData) {
        this.trackData = trackData;
    };

    addFeatureData(featureData) {
        this.featureData = featureData;
    };
    getTrackData(trackData) {
        return this.trackData;
    };
    getFeatureData(featureData) {
        return this.featureData;
    };

}



class ThreeJsComponent extends Component {

  constructor (props){
    super(props);
    this.particles = new Map();
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
    var geometry = new THREE.BoxGeometry(2, 0.5, 0.5);
    var material = new THREE.MeshBasicMaterial({ color: 0x333300 });
    var cube = new THREE.Mesh(geometry, material);
    cube.position.x = Math.floor(Math.random() * 4);
    cube.position.y = Math.floor(Math.random() * 4);
    this.scene.add(cube);
  }
  
  handleUpdate(){
    console.log(`render particle ${this.props.particles} in Visualize`);
    const currentState = [];
    for (const p in this.props.particles){
      //console.log(p);
      this.renderParticle(p);
      this.particles.push(p);
    }
    
    this.renderer.render(this.scene, this.camera);
    console.log('rendered', this.particles);
    //somehow add orbit control js, which allow drag to rotate camera
    //https://github.com/brycedli/spotify-visualized/blob/aa9485c2b8b2a4f60869ac57ae89cd051da053bb/django-spotify/spotme/templates/spotme/visualize.html#L470
    console.log("rendered");
  }
  
  componentDidMount(){
    //handle login redirect
    const _particles = this.particles;
    authenticateSpotify(window.location);
    getTopSongs(function(data_particles){
      console.log('particles',data_particles, _particles.size);
      
      data_particles.forEach(function(value, key) {
        _particles.set(key, value);
      })

      
        // getFeatures(function(){
        //     console.log("done", particles);

        // });
    });
    

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
    );

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    console.log(this.mount);
    this.mount.appendChild(this.renderer.domElement);

    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    var cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube);

    this.camera.position.z = 5;

    this.renderer.render(this.scene, this.camera);
    var _renderer = this.renderer;
    var _scene = this.scene;
    var _camera = this.camera;
    var animate = function () {
      requestAnimationFrame( animate );
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      _renderer.render( _scene, _camera );
    };
    animate();
  }

  render(){
    return (
      <div>
        <p>
            Visualize stuff here
        </p>
        <p>
          {/* particles: {this.props.particle} */}
        </p>
        {/* <ul>
          {this.props.particles.map(p => (
          <li>{p}</li>
          ))}
        </ul> */}
        <div 
            style={{ width: "800px", height: "800px" }}
            ref={mount => { this.mount = mount}}
        />
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
