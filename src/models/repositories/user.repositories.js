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

module.exports = {
  create,
  findByEmail,
  findById
}
