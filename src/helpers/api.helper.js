class ApiHelper {
  static async requestHandler(asyncFunc, errorMessage = "Error") {
    try {
      await asyncFunc();
    } catch (error) {
      this.handleError(error, errorMessage);
    }
  }

  static handleError(error, message) {
    console.error(message, error);
  }
}
