const { model, Schema, Types } = require('mongoose')

const DOCUMENT_NAME = 'Session'
const COLLECTION_NAME = 'Sessions'

const sessionSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      required: true,
      ref: 'User'
    },
    publicKey: {
      type: String,
      required: true
    },
    privateKey: {
      type: String,
      required: true
    },
    refreshToken: {
      type: String,
      required: true
    },
    refreshTokenUsed: {
      type: [String],
      default: []
    },
    deviceId: {
      type: String,
      default: ''
    },
    isDisable: {
      type: Boolean,
      default: false
    },
    isDelete: {
      type: Boolean,
      default: false
    },
    isDefault: {
      type: Boolean,
      default: false
    },
    createdBy: {
      type: Types.ObjectId,
      required: true,
      ref: 'User'
    },
    modifiedBy: {
      type: Types.ObjectId,
      required: true,
      ref: 'User'
    }
  },
  {
    timestamps: {
      createdAt: 'createdDate',
      updatedAt: 'modifiedDate'
    },
    collection: COLLECTION_NAME
  }
)

module.exports = model(DOCUMENT_NAME, sessionSchema)
