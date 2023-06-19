const { model, Schema } = require('mongoose')

const DOCUMENT_NAME = 'ApiKey'
const COLLECTION_NAME = 'ApiKeys'

const apiKeySchema = Schema(
  {
    key: {
      type: String,
      required: true,
      index: true,
      default: ''
    },
    permissions: {
      type: [String],
      required: true,
      default: ['auth', 'upload', 'payment', 'logs']
    },
    isDisable: {
      type: Boolean,
      default: false,
      required: true
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false
    },
    isDefault: {
      type: Boolean,
      required: true,
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
