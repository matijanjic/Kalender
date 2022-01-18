class ApiError {
  constructor(code, message) {
    this.code = code;
    this.message = `error: ${message}`;
  }

  static authorizationError(message) {
    return new ApiError(401, message);
  }

  static badRequest(message) {
    return new ApiError(400, message);
  }
}

module.exports = ApiError;
