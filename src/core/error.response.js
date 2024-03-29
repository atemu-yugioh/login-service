const { ReasonPhrases, StatusCodes } = require('../utils/httpStatusCode')

class ErrorResponse extends Error {
  constructor(message, status, timestamp = new Date().getTime()) {
    super(message)
    this.status = status
    this.timestamp = timestamp
  }
}

class BadRequestError extends ErrorResponse {
  constructor(message = ReasonPhrases.BAD_REQUEST, status = StatusCodes.BAD_REQUEST) {
    super(message, status)
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(message = ReasonPhrases.CONFLICT, status = StatusCodes.CONFLICT) {
    super(message, status)
  }
}

class NotFoundError extends ErrorResponse {
  constructor(message = ReasonPhrases.NOT_FOUND, status = StatusCodes.NOT_FOUND) {
    super(message, status)
  }
}

class AuthFailError extends ErrorResponse {
  constructor(message = ReasonPhrases.UNAUTHORIZED, status = StatusCodes.UNAUTHORIZED) {
    super(message, status)
  }
}

class ForbiddenError extends ErrorResponse {
  constructor(message = ReasonPhrases.FORBIDDEN, status = StatusCodes.FORBIDDEN) {
    super(message, status)
  }
}

class InputValidateError extends ErrorResponse {
  constructor(errors = null, message = 'input validate fail', status = 422) {
    super(message, status)
    this.errors = errors
  }
}

class TooManyRequestError extends ErrorResponse {
  constructor(message = ReasonPhrases.TOO_MANY_REQUESTS, status = StatusCodes.TOO_MANY_REQUESTS) {
    super(message, status)
  }
}

module.exports = {
  BadRequestError,
  NotFoundError,
  ConflictRequestError,
  AuthFailError,
  ForbiddenError,
  InputValidateError,
  TooManyRequestError
}
