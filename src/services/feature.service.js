class FeatureService {
  static baseUrl = "/Feature";

  static getAllFeatures() {
    return ApiService.get(`${this.baseUrl}`);
  }

  static getFeatureById(id) {
    return ApiService.get(`${this.baseUrl}/${id}`);
  }

  static createFeature(feature) {
    return ApiService.post(`${this.baseUrl}`, feature);
  }

  static updateFeature(id, feature) {
    return ApiService.put(`${this.baseUrl}/${id}`, feature);
  }

  static deleteFeature(id) {
    return ApiService.delete(`${this.baseUrl}/${id}`);
  }
}
