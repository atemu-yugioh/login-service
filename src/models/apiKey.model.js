const { model, Schema } = require('mongoose')

const DOCUMENT_NAME = 'ApiKey'
const COLLECTION_NAME = 'Apikeys'

const apiKeySchema = Schema(
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
    isDisabled: {
      type: Boolean,
      default: false
    },
    isDeleted: {
      type: String,
      default: false
    },
    isDefault: {
      type: Boolean,
      default: false
    },
    createdBy: {
      type: String,
      required: true,
      default: 'admin'
    },
    modifiedBy: {
      type: String,
      required: true,
      default: 'admin'
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
