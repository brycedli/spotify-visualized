import { map } from "async";
import { Component, createElement } from "react";
import * as THREE from "three";

var accessToken;
var hash = {};
var particles = new Map();
window.location.hash.replace(/^#\/?/, '').split('&').forEach(function(kv) {
    var spl = kv.indexOf('=');
    if (spl != -1) {
        hash[kv.substring(0, spl)] = decodeURIComponent(kv.substring(spl+1));
    }
    
});
var maxSongs = 400;

// console.log('initial hash', hash);
if (hash.access_token){
    // initializeThree();
    accessToken = hash.access_token;

    //var url = 'https://api.spotify.com/v1/me/tracks?time_range=short_term&limit=10';
    var url = 'https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=10'
    getTopSongs(url, function(){
        getFeatures(function(){
            console.log("done", particles);

        });
    });

    function getFeatures(callback){
        function analyzeTrack(accessToken, arr) {
            var newArr = [];
            //GET https://api.spotify.com/v1/audio-analysis/{id}
            arr.forEach(function (item, index, array) {
                newArr.push(item.getTrackData().id);
                // console.log(item.getTrackData().id); 
            });
            var fullURL = 'https://api.spotify.com/v1/audio-features?ids=' + newArr.join(",");
            // console.log(arr.join(","));
            return fetch(fullURL, {
                method: 'GET',

                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                },

            });

        }
        var mapArray = Array.from(particles.values());
            requestTrackWrapper(0);
            function requestTrackWrapper(index) {
                var maxedIndex = Math.min(index + 50, mapArray.length);
                analyzeTrack(accessToken, mapArray.slice(index, maxedIndex)).then((response) => {
                    return response.json();
                }).then((data) => {
                    setTimeout(function () {
                        // loadingText.textContent = "analyzing " + maxedIndex + "/" +  mapArray.length + ' songs...';
                        // loadingText.style.display = 'block';
                        console.log("maxed:", maxedIndex, "index", index);
                        if (data) {
                            console.log(data);

                            data.audio_features.forEach(function (item, index, array) {
                                if (item && item.id && particles.get(item.id)){
                                    particles.get(item.id).addFeatureData(item);
                                }
                            });
                        } else {
                            console.log("no data");
                        }
                        if (maxedIndex < mapArray.length){
                            requestTrackWrapper(maxedIndex);

                        }else{
                            // loadingText.style.display = 'none';
                            callback();
                            // console.log("done");
                            // renderData();
                        }
                    }, 5);

                });
            }
    }
    function getTopSongs(url, callback){
        
        fetch(url,{
            method: 'GET',
            headers:{
                'Authorization' : 'Bearer ' + accessToken,
            },
    
        }).then((response)=>{
            return response.json();
        }).then((data)=> {
            console.log(data);

            data.items.forEach(function(item, index, array) {
                var particle = new Particle();
                particle.addTrackData(item);
                // console.log(item.track.name, item.track.artists[0].name);
                if(!item){
                    console.log("item not found in initial song loop");
                }

                if (!particles.get(item.id)) {
                    particles.set(item.id, particle);
    
                } else {
                    console.log("Duplicate item, skipping");
                }
                

            })
            console.log(data.next, data.offset);

            // if (maxSongs > particles.size){
            //     getTopSongs(data.next, callback);

            // }
            if (data.next) {

                getTopSongs(data.next, callback);
            } 
            else {
                callback();
            }
        });
    }
    
}
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



class ThreeComponent extends Component {
    constructor (props){
        super(props);
        
    }
    handleUpdate(particles){
        if (particles){
            //do particle addition logic here, otherwise render.
        }
        this.renderer.render(this.scene, this.camera);
        console.log("rendered");
    }
    
    // return <h1>Hello</h1>;
    componentDidMount(){
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
        );

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.mount.appendChild(this.renderer.domElement);

        var geometry = new THREE.BoxGeometry(1, 1, 1);
        var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        var cube = new THREE.Mesh(geometry, material);
        this.scene.add(cube);

        this.camera.position.z = 5;

        this.renderer.render(this.scene, this.camera);
    }
    render(){
        return (<div 
            style={{ width: "800px", height: "800px" }}
            ref={mount => { this.mount = mount}}
            />)
    }

    
}
// console.log("creating component")
// const objType = createElement(ThreeComponent,{ name:"nnamdi" });
// objType.handleUpdate();
var threeCompRef;

export default function VisualizePage(){
    return(
        <div>
            <p>
                Visualize stuff here
            </p>
            <ThreeComponent ref={this.threeCompRef}/>
        </div>
    )
}
// threeCompRef.handleUpdate();
