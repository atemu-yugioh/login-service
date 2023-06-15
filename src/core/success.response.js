const { StatusCodes, ReasonPhrases } = require('../utils/httpStatusCode')

class SuccessResponse {
  constructor({ status = StatusCodes.OK, message, reasonPhrases = ReasonPhrases.OK, data = {} }) {
    this.status = status
    this.message = message ? message : reasonPhrases
    this.data = data
  }

  send(res, header = {}) {
    return res.status(this.status).json(this)
  }
}

class OK extends SuccessResponse {
  constructor({ message, data }) {
    super({ message, data })
  }
}

class CREATED extends SuccessResponse {
  constructor({ status = StatusCodes.CREATED, message, reasonPhrases = ReasonPhrases.CREATED, data, option = {} }) {
    super({ status, message, reasonPhrases, data })
    this.option = option
  }
}

module.exports = {
  SuccessResponse,
  OK,
  CREATED
}
