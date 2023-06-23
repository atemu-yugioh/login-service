const { convertToObjectMongodbId } = require('../../utils')
const sessionTokenModel = require('../sessionToken.model')

const createSessionToken = async ({ deviceId, userId, publicKey, privateKey, refreshToken, createdBy, modifiedBy }) => {
  // return await sessionTokenModel.create(sessionToken)

  const filter = { user: userId, deviceId }
  const update = {
    publicKey,
    privateKey,
    refreshToken,
    refreshTokenUsed: [],
    createdBy,
    modifiedBy
  }
  const option = {
    upsert: true,
    new: true
  }

  const tokens = await sessionTokenModel.findOneAndUpdate(filter, update, option)

  return tokens ? tokens.publicKey : null
}

const findByUserId = async (userId) => {
  return await sessionTokenModel.findOne({ user: convertToObjectMongodbId(userId) }).lean()
}

const findByUserIdAndDeviceId = async ({ userId, deviceId }) => {
  return await sessionTokenModel.findOne({ user: convertToObjectMongodbId(userId), deviceId }).lean()
}

const deleteByDeviceId = async (deviceId) => {
  return await sessionTokenModel.deleteOne({ deviceId })
}

const deleteKeyByUserId = async (userId) => {
  return await sessionTokenModel.deleteOne({ user: convertToObjectMongodbId(userId) })
}

const updateRefreshTokenByUserId = async ({ deviceId, userId, refreshToken, newRefreshToken }) => {
  const filter = { user: convertToObjectMongodbId(userId), deviceId }
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
  return await sessionTokenModel.updateOne(filter, updateSet, option)
}

module.exports = {
  createSessionToken,
  findByUserId,
  deleteByDeviceId,
  deleteKeyByUserId,
  updateRefreshTokenByUserId,
  findByUserIdAndDeviceId
}
