const { convertToObjectMongodbId } = require('../../utils')
const keyTokenModel = require('../keyToken.model')

const createKeyToken = async ({ deviceId, userId, publicKey, privateKey, refreshToken, createdBy, modifiedBy }) => {
  // return await keyTokenModel
  //   .create({
  //     user,
  //     publicKey,
  //     privateKey,
  //     refreshToken,
  //     createdBy,
  //     modifiedBy
  //   })
  //   .then((res) => {
  //     return res._doc
  //   })
  try {
    const filter = { user: userId, deviceId }
    const update = {
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
    const tokens = await keyTokenModel.findOneAndUpdate(filter, update, option)

    return tokens ? tokens.publicKey : null
  } catch (error) {
    return error
  }
}

const findByUserIdAdnDeviceId = async ({ userId, deviceId }) => {
  return await keyTokenModel.findOne({ user: convertToObjectMongodbId(userId), deviceId }).lean()
}

const deleteByDeviceId = async (deviceId) => {
  return await keyTokenModel.deleteOne({ deviceId })
}

const deleteByUserId = async (userId) => {
  return await keyTokenModel.deleteMany({ user: convertToObjectMongodbId(userId) })
}

const updateRefreshToken = async ({ userId, deviceId, refreshToken, newRefreshToken }) => {
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

  return await keyTokenModel.updateOne(filter, updateSet, option)
}

module.exports = {
  createKeyToken,
  findByUserIdAdnDeviceId,
  deleteByDeviceId,
  deleteByUserId,
  updateRefreshToken
}
