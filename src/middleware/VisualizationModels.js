import * as THREE from "three";


export class Particle {
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

export class SpecialView {
  // element;
  // vectorPos;
  addTexture (textURL){
      // var texture = new THREE.TextureLoader().load(textURL);
      // trackTexture = texture;
      var img = document.createElement('img');
      img.src = textURL;
      this.element.appendChild(img);
  };
  addName(name){
      if (this.element){
          var titleText = document.createElement('p');
          titleText.textContent = name;
          this.element.appendChild(titleText);
      }else{
          console.log("called before element");
      }
  };
  addElement (element) {
      this.element = element;
  };

  addVector(vectorPos){
      this.vectorPos = new THREE.Vector3(vectorPos.x, vectorPos.y, vectorPos.z);
  };
}

var isFloat = function(n) { return parseFloat(n) === n};

export const extractSongFromParticle = (particleValue) => {
  let item = null;
  try {
    const _songData = particleValue.trackData;
    const _featureData = particleValue.featureData;
    const _featureLikely = [];
    
    for (const [_fk, _fv] of Object.entries(_featureData)) {
      //console.log('_featureLikely checking',_fv,_fk);
      if(isFloat(_fv) && _fv <1 && _fv >= 0.5){
        _featureLikely.push(_fk);
      }
    }
    item = {id:_songData.id,name:_songData.name,thumbnail_url:_songData.album.images[2].url,genre:_featureLikely.join(', ')};
    //console.log('_featureLikely',item);
    
  }catch(e){
    console.error(e);
  }
  return item;
}