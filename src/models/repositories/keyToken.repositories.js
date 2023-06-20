const keyTokenModel = require('../keyToken.model')

const createKeyToken = async ({ userId, publicKey, privateKey, refreshToken, createdBy, modifiedBy }) => {
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
    const filter = { user: userId }
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

module.exports = {
  createKeyToken
}
