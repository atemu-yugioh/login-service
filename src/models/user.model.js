const { model, Schema } = require('mongoose')

const DOCUMENT_NAME = 'User'
const COLLECTION_NAME = 'Users'

const userSchema = Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
      default: ''
    },
    address: {
      type: String,
      default: false
    },
    isDefault: {
      type: Boolean,
      default: false
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    isDeleted: {
      type: Boolean,
      default: false
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

module.exports = model(DOCUMENT_NAME, userSchema)
