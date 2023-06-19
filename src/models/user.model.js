const { model, Schema } = require('mongoose')

const DOCUMENT_NAME = 'User'
const COLLECTION_NAME = 'Users'

const userSchema = Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true,
      maxLength: 150
    },
    password: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      type: String
    },
    avatar: {
      type: String
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'inactive'
    },
    verify: {
      type: Boolean,
      default: false
    },
    roles: {
      type: Array,
      default: []
    },
    isDisable: {
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
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    isDefault: {
      type: Boolean,
      default: false
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
