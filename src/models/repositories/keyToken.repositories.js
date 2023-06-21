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

module.exports = {
  createKeyToken
}
