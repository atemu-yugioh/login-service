const { convertToObjectMongodbId } = require('../../utils')
const userModel = require('../user.model')

const findByEmail = async (email) => {
  return await userModel.findOne({ email }).lean()
}

const createUser = async ({ _id, email, name, phone, password, roles = ['user'], createdBy, modifiedBy, ...other }) => {
  return await userModel
    .create({ _id, email, name, phone, password, roles, createdBy, modifiedBy, ...other })
    .then((result) => {
      return result._doc
    })
}

const updatePassword = async (userId, password) => {
  const filter = { _id: convertToObjectMongodbId(userId) }
  const updateSet = {
    $set: {
      password: password
    }
  }
  const option = {
    upsert: true,
    new: true
  }

  return await userModel.updateOne(filter, updateSet, option)
}

module.exports = {
  findByEmail,
  createUser,
  updatePassword
}
