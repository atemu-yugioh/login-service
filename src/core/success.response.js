const { StatusCodes, ReasonPhrases } = require('../utils/httpStatusCode')

class SuccessResponse {
  constructor({ status = StatusCodes.OK, message, data, reasonPhrases = ReasonPhrases.OK }) {
    this.status = status
    this.message = message ? message : reasonPhrases
    this.data = data
  }
}

class OK extends SuccessResponse {
  constructor({ message, data }) {
    super({ message, data })
  }
}

class CREATED extends SuccessResponse {
  constructor({ status = StatusCodes.CREATED, message, data, reasonPhrases = ReasonPhrases.CREATED, option = {} }) {
    super(status, message, data, reasonPhrases)
    this.option = option
  }
}
module.exports = {
  SuccessResponse,
  OK,
  CREATED
}
