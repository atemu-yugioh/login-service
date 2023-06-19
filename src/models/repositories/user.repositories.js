const userModel = require('../user.model')

const createUser = async (user) => {
  return await userModel.create(user)
}

const findByEmail = async (email) => {
  return await userModel.findOne({ email }).lean()
}

module.exports = {
  createUser,
  findByEmail
}
