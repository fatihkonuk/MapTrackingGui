class ApiService {
  static baseUrl = "http://localhost:5260/api";

  static async request(resource, method = "GET", params = null) {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (params) {
      options.body = JSON.stringify(params);
    }

    try {
      const response = await fetch(`${this.baseUrl}${resource}`, options);
      return ApiService.handleResponse(response);
    } catch (error) {
      throw new Error(`Network Error: ${error.message}`);
    }
  }

  static async handleResponse(response) {
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    return response.json();
  }

  static get(resource) {
    return ApiService.request(resource);
  }

  static post(resource, params) {
    return ApiService.request(resource, "POST", params);
  }

  static put(resource, params) {
    return ApiService.request(resource, "PUT", params);
  }

  static delete(resource) {
    return ApiService.request(resource, "DELETE");
  }
}

