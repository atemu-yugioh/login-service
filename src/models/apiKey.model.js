const { model, Schema } = require('mongoose')

const DOCUMENT_NAME = 'ApiKey'
const COLLECTION_NAME = 'ApiKeys'

// Declare the Schema of the Mongo model
var apiKeySchema = Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    status: {
      type: Boolean,
      default: true
    },
    permissions: {
      type: [String],
      require: true,
      enum: ['create', 'read', 'update', 'delete']
    },
    createdBy: {
      type: String,
      require: true,
      default: 'admin'
    },

    modifiedBy: {
      type: String,
      require: true,
      default: ''
    },

    isDisabled: {
      type: Boolean,
      default: false,
      require: true
    },
    isDeleted: {
      type: Boolean,
      default: false,
      required: true
    },
    isDefault: {
      type: Boolean,
      default: false,
      select: false
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

//Export the model
module.exports = model(DOCUMENT_NAME, apiKeySchema)
