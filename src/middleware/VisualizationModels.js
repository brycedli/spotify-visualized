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