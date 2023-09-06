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

module.exports = {
  create,
  findByEmail,
  findById
}
