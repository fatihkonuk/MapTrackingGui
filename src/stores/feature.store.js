class FeatureStore {
    static featureList = [];
    static feature = {};
  
    static setFeatureList(featureList) {
      this.featureList = featureList;
    }
  
    static getFeatureList() {
      return this.featureList;
    }
  
    static setFeature(feature) {
      this.feature = feature;
    }
  
    static getFeature() {
      return this.feature;
    }
  }
  