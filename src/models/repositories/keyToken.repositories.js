const { convertToObjectMongodbId } = require('../../utils')
const keyTokenModel = require('../keyToken.model')

const createKeyToken = async ({ userId, publicKey, privateKey, refreshToken, createdBy, modifiedBy }) => {
  // return await keyTokenModel.create(keyToken)

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

  const tokens = await keyTokenModel.findOneAndUpdate(filter, update, option)

  return tokens ? tokens.publicKey : null
}

const findByUserId = async (userId) => {
  return await keyTokenModel.findOne({ user: convertToObjectMongodbId(userId) }).lean()
}

const removeKeyById = async (id) => {
  return await keyTokenModel.deleteOne({ _id: convertToObjectMongodbId(id) })
}

const deleteKeyBuUserId = async (userId) => {
  return await keyTokenModel.deleteOne({ user: convertToObjectMongodbId(userId) })
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
  return await keyTokenModel.updateOne(filter, updateSet, option)
}

module.exports = {
  createKeyToken,
  findByUserId,
  removeKeyById,
  deleteKeyBuUserId,
  updateRefreshTokenByUserId
}
