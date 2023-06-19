const sessionModel = require('../session.model')

const createSession = async (session) => {
  return await sessionModel.create(session)
}

module.exports = {
  createSession
}
