const { convertToObjectMongodbId } = require('../../utils')
const sessionModel = require('../session.model')

const create = async ({ userId, publicKey, privateKey, refreshToken, deviceId, createdBy, modifiedBy }) => {
  const filter = { user: convertToObjectMongodbId(userId), deviceId }

  const updateSet = {
    publicKey,
    privateKey,
    refreshToken,
    createdBy,
    modifiedBy,
    refreshTokenUsed: []
  }

  const option = {
    upsert: true,
    new: true
  }

  return await sessionModel.findOneAndUpdate(filter, updateSet, option)
}

const deleteById = async (id) => {
  return await sessionModel.deleteOne({ _id: id })
}

const deleteByUserId = async (userId) => {
  return await sessionModel.deleteMany({ user: convertToObjectMongodbId(userId) })
}

const findByUserIdAndSessionId = async (userId, deviceId) => {
  return await sessionModel.findOne({ user: userId, deviceId }).lean()
}

const saveToRefreshTokenUsed = async ({ refreshToken, _id, newRefreshToken }) => {
  const filter = { _id }

  const updateSet = {
    $set: {
      refreshToken: newRefreshToken
    },
    $addToSet: {
      refreshTokenUsed: refreshToken
    }
  }

  const option = {
    upsert: true,
    new: true
  }

  return await sessionModel.updateOne(filter, updateSet, option)
}

module.exports = {
  create,
  deleteById,
  findByUserIdAndSessionId,
  deleteByUserId,
  saveToRefreshTokenUsed
}
