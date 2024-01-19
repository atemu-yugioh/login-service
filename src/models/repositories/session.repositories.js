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

  return sessionModel.findOneAndUpdate(filter, updateSet, option)
}

const deleteById = async (id) => {
  return sessionModel.deleteOne({ _id: id })
}

const deleteByUserId = async (userId) => {
  return sessionModel.deleteMany({ user: convertToObjectMongodbId(userId) })
}

const findByUserIdAndSessionId = async (userId, deviceId) => {
  return sessionModel.findOne({ user: userId, deviceId }).lean()
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

  return sessionModel.updateOne(filter, updateSet, option)
}

module.exports = {
  create,
  deleteById,
  findByUserIdAndSessionId,
  deleteByUserId,
  saveToRefreshTokenUsed
}
