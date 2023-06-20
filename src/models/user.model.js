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
      required: true
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
      type: String,
      default: false
    },
    isDeleted: {
      type: String,
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
    }
  }
)

module.exports = model(DOCUMENT_NAME, userSchema)
