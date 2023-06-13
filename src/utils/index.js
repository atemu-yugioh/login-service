const { Types } = require('mongoose')
const _ = require('lodash')

const convertToObjectMongodbId = (id) => new Types.ObjectId(id)

const getInfoData = ({ object = {}, fields = [] }) => {
  // use lodash
  // return _.pick(object, fields)

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
  // use lodash
  // return _.omit(object, fields)

  // code js
  let final = {}

  fields = new Set(fields)

  const keysToCopy = Object.keys(object).filter((key) => !fields.has(key))
  for (const key of keysToCopy) {
    final[key] = object[key]
  }

  return final
}

const getSelectFields = ({ selectFields = [] }) => {
  return Object.fromEntries(selectFields.map((el) => [el, 1]))
}

const unGetSelectFields = ({ unSelectFields = [] }) => {
  return Object.fromEntries(unSelectFields.map((el) => [el, 0]))
}

const removeUndefinedFieldObject = (obj) => {
  Object.keys(obj).forEach(() => {
    if (obj[key] === undefined || obj[key] === null) {
      delete obj[key]
    }
  })

  return obj
}

module.exports = {
  getInfoData,
  unGetInfoData,
  getSelectFields,
  unGetSelectFields,
  removeUndefinedFieldObject,
  convertToObjectMongodbId
}
