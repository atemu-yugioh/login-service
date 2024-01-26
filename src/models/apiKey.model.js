const { model, Schema } = require('mongoose')

const DOCUMENT_NAME = 'ApiKey'
const COLLECTION_NAME = 'ApiKeys'

const apiKeySchema = new Schema(
  {
    key: {
      type: String,
      required: true
    },
    permissions: {
      type: [String],
      required: true,
      default: ['auth', 'upload', 'logs', 'search', 'payment']
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
      type: String,
      default: 'Admin',
      required: true
    },
    modifiedBy: {
      type: String,
      default: 'Admin',
      required: true
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

module.exports = model(DOCUMENT_NAME, apiKeySchema)
