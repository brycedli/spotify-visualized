import { map } from "async";

var accessToken;
var hash = {};
var particles = new Map();
window.location.hash.replace(/^#\/?/, '').split('&').forEach(function(kv) {
    var spl = kv.indexOf('=');
    if (spl != -1) {
        hash[kv.substring(0, spl)] = decodeURIComponent(kv.substring(spl+1));
    }
    
});
// var maxSongs = 100;

console.log('initial hash', hash);
if (hash.access_token){
    accessToken = hash.access_token;
    var url = 'https://api.spotify.com/v1/me/tracks?time_range=long_term&limit=50';
    getTopSongs(url, function(){
        console.log(particles);
        getFeatures();
    });

    function getFeatures(){
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
                            console.log("done");
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
            // console.log(data);
            data.items.forEach(function(item, index, array) {
                var particle = new Particle();
                particle.addTrackData(item.track);
                if(!item){
                    console.log("item not found in initial song loop");
                }
                if (!item.track){
                    console.log("no track found", item);
                    return;
                }
                if (!particles.get(item.track.id)) {
                    particles.set(item.track.id, particle);
    
                } else {
                    console.log("Duplicate item, skipping");
                }
                

            })
            if (data.next) {
                getTopSongs(data.next, callback);
            } else {
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
export default function VisualizePage(){
    return(
        <div>
            <p>
                Visualize stuff here
            </p>
        </div>
    )
}