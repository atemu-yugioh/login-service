const { convertToObjectMongodbId } = require('../../utils')
const sessionTokenModel = require('../sessionToken.model')

const createSessionToken = async ({ userId, publicKey, privateKey, refreshToken, createdBy, modifiedBy }) => {
  // return await sessionTokenModel.create(sessionToken)

  const filter = { user: userId }
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

const removeKeyById = async (id) => {
  return await sessionTokenModel.deleteOne({ _id: convertToObjectMongodbId(id) })
}

const deleteKeyBuUserId = async (userId) => {
  return await sessionTokenModel.deleteOne({ user: convertToObjectMongodbId(userId) })
}

const updateRefreshTokenByUserId = async ({ userId, refreshToken, newRefreshToken }) => {
  const filter = { user: convertToObjectMongodbId(userId) }
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
  removeKeyById,
  deleteKeyBuUserId,
  updateRefreshTokenByUserId
}
