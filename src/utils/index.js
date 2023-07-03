const _ = require('lodash')
const { Types } = require('mongoose')

const convertToObjectMongodbId = (id) => new Types.ObjectId(id)

const getInfoData = ({ object = {}, fields = [] }) => {
  // return _.pick(object,fields)

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
  // return _.omit(object,fields)

  // code js

  const final = {}

  fields = new Set(fields)
  const keysToCopy = Object.keys(object).filter((key) => !fields.has(key))
  for (const key of keysToCopy) {
    final[key] = object[key]
  }

  return final
}

const getSelectField = (setlectFields = []) => {
  return Object.fromEntries(setlectFields.map((el) => [el, 1]))
}

const unGetSelectField = (unGetSelectFields = []) => {
  return Object.fromEntries(unGetSelectFields.map((el) => [el, 0]))
}

const removeUndefinedFieldObject = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === undefined || obj[key] === null) {
      delete obj[key]
    }
  })
  return obj
}

const generateObjectMongodb = () => new Types.ObjectId()
module.exports = {
  getInfoData,
  unGetInfoData,
  getSelectField,
  unGetSelectField,
  removeUndefinedFieldObject,
  convertToObjectMongodbId,
  generateObjectMongodb
}
