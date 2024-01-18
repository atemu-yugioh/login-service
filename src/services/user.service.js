const { findById } = require('../models/repositories/user.repositories')
const { getInfoData } = require('../utils')

const selectFields = ['name', 'email', 'phone', 'address', 'birthDay', 'avatar', 'is2FAEnabled']

class UserService {
  static findById = async (id) => {
    const userFound = await findById(id)

    return {
      user: getInfoData({ object: userFound, fields: selectFields })
    }
  }
}

module.exports = UserService
