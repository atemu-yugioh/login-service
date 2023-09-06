const { Types } = require('mongoose')

const getInfoData = ({ object = {}, fields = [] }) => {
  // using lodash
  //   return _.pick(object, fields)

  // code js
  const final = {}

  fields = new Set(fields)

  const keysToCopy = Object.keys(object).filter((key) => fields.has(key))

  for (const key of keysToCopy) {
    final[key] = object[key]
  }

  return final
}

const unGetInfoData = ({ object = {}, fields = [] }) => {
  // using lodash
  //   return _.omit(object, fields)

  // code js
  const final = {}
  fields = new Set(fields)

  const keysToCopy = Object.keys(object).filter((key) => !fields.has(key))

  for (const key of keysToCopy) {
    final[key] = object[key]
  }

  return final
}

const convertToObjectMongodbId = (id) => new Types.ObjectId(id)

const generateObjectMongodbId = () => new Types.ObjectId()

module.exports = {
  getInfoData,
  unGetInfoData,
  convertToObjectMongodbId,
  generateObjectMongodbId
}
