class ApiError {
  constructor(code, message) {
    this.code = code;
    this.message = `error: ${message}`;
  }

  static badRequest(message) {
    return new ApiError(400, message);
  }

  static authorizationError(message) {
    return new ApiError(401, message);
  }

  static notFound(message) {
    return new ApiError(404, message);
  }
}

module.exports = ApiError;
