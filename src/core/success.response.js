const { StatusCodes, ReasonPhrases } = require('../utils/httpStatusCode')

class SuccessResponse {
  constructor({ status = StatusCodes.OK, message, data, reasonPhrase = ReasonPhrases.OK }) {
    this.status = status
    this.message = message || reasonPhrase
    this.data = data || null
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
  constructor({ status = StatusCodes.CREATED, message, data, reasonPhrase = ReasonPhrases.CREATED, option = {} }) {
    super({ status, message, data, reasonPhrase })
    this.option = option
  }
}

module.exports = {
  SuccessResponse,
  OK,
  CREATED
}
