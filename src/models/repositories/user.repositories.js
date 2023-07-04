const { convertToObjectMongodbId } = require('../../utils')
const userModel = require('../user.model')

const create = async ({ _id, email, name, password, phone, createdBy, modifiedBy, ...other }) => {
  return userModel.create({ _id, email, name, password, phone, createdBy, modifiedBy, ...other })
}

const findByEmail = async (email) => {
  return userModel.findOne({ email }).lean()
}

const findById = async (id) => {
  return userModel.findOne({ _id: convertToObjectMongodbId(id) }).lean()
}

const updatePassword = async (userId, password) => {
  const filter = { _id: convertToObjectMongodbId(userId) }
  const updateSet = {
    $set: {
      password
    }
  }
  const option = {
    upsert: true,
    new: true
  }

  return await userModel.updateOne(filter, updateSet, option)
}

module.exports = {
  create,
  findByEmail,
  findById,
  updatePassword
}
