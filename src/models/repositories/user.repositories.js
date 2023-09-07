const { convertToObjectMongodbId } = require('../../utils')
const userModel = require('../user.model')

const create = async ({ _id, name, email, password, phone, createdBy, modifiedBy, ...other }) => {
  return userModel.create({ _id, name, email, password, phone, createdBy, modifiedBy, ...other })
}

const findByEmail = async (email) => {
  return await userModel.findOne({ email }).lean()
}

const findById = async (id) => {
  return await userModel.findById(id).lean()
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
