const keyTokenModel = require('../keyToken.model')

const createKeyToken = async ({ user, publicKey, privateKey, refreshToken, createdBy, modifiedBy }) => {
  return await keyTokenModel
    .create({
      user,
      publicKey,
      privateKey,
      refreshToken,
      createdBy,
      modifiedBy
    })
    .then((res) => {
      return res._doc
    })
}

module.exports = {
  createKeyToken
}
