const { model, Schema } = require('mongoose')

const DOCUMENT_NAME = 'Session'
const COLLECTION_NAME = 'Sessions'

const sessionSchema = Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
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
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    modifiedBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    isDeleted: {
      type: String,
      default: false
    },
    isDefault: {
      type: String,
      default: false
    }
  },
  {
    timestamps: {
      createdAd: 'createdDate',
      updatedAt: 'modifiedDate'
    },
    collection: COLLECTION_NAME
  }
)

module.exports = model(DOCUMENT_NAME, sessionSchema)
