const { ReasonPhrases, StatusCodes } = require('../utils/httpStatusCode')
const reasonPhrases = require('../utils/reasonPhrases')

class ErrorResponse extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(status = StatusCodes.CONFLICT, message = ReasonPhrases.CONFLICT) {
    super(status, message)
  }
}

class BadRequestError extends ErrorResponse {
  constructor(status = StatusCodes.BAD_REQUEST, message = ReasonPhrases.BAD_REQUEST) {
    super(status, message)
  }
}

class AuthFailureError extends ErrorResponse {
  constructor(status = StatusCodes.UNAUTHORIZED, message = ReasonPhrases.UNAUTHORIZED) {
    super(status, message)
  }
}

class NotFoundError extends ErrorResponse {
  constructor(status = StatusCodes.NOT_FOUND, message = ReasonPhrases.NOT_FOUND) {
    super(status, message)
  }
}

class ForbiddenError extends ErrorResponse {
  constructor(status = StatusCodes.FORBIDDEN, message = reasonPhrases.FORBIDDEN) {
    super(status, message)
  }
}

module.exports = {
  ErrorResponse,
  ConflictRequestError,
  BadRequestError,
  AuthFailureError,
  NotFoundError,
  ForbiddenError
}
