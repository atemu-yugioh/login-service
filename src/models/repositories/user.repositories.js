const userModel = require('../user.model')

const findByEmail = async (email) => {
  return await userModel.findOne({ email }).lean()
}

const createUser = async ({ _id, email, name, phone, password, roles = ['user'], createdBy, modifiedBy, ...other }) => {
  console.log('🚀 ~ file: auth.repositories.js:8 ~ createUser ~ other:', other)
  return await userModel
    .create({ _id, email, name, phone, password, roles, createdBy, modifiedBy, ...other })
    .then((result) => {
      return result._doc
    })
}

module.exports = {
  findByEmail,
  createUser
}
