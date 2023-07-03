const { convertToObjectMongodbId } = require('../../utils')
const sessionModel = require('../session.model')

const create = async ({ userId, publicKey, privateKey, refreshToken, deviceId, createdby, modifiedby }) => {
  const filter = { user: convertToObjectMongodbId(userId), deviceId }

  const updateSet = {
    publicKey,
    privateKey,
    refreshToken,
    createdby,
    modifiedby,
    refreshTokenUsed: []
  }

  const option = {
    upsert: true,
    new: true
  }

  return await sessionModel.findOneAndUpdate(filter, updateSet, option)
}

const findByUserIdAndDeviceId = async (userId, deviceId) => {
  return await sessionModel.findOne({ user: convertToObjectMongodbId(userId), deviceId }).lean()
}
const deleteById = async (id) => {
  return sessionModel.deleteOne({ _id: convertToObjectMongodbId(id) })
}

module.exports = {
  create,
  findByUserIdAndDeviceId,
  deleteById
}
