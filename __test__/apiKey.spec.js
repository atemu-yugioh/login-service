const mongoose = require('mongoose')
const request = require('supertest')
const app = require('../src/app')
const {
  db: { host, port, name }
} = require('../src/configs/app.config')
const apiKeyModel = require('../src/models/apiKey.model')

// create api test
const apiKeyTest = {
  key: 'api-key-test',
  permissions: [],
  createdBy: 'Tester',
  deviceId: 'device-id-test'
}
const validHeader = {
  'x-api-key': apiKeyTest.key,
  'x-device-id': apiKeyTest.deviceId
}

const getApiKey = async (option = {}) => {
  const agent = request(app).get('/api/v1/api-key')

  for (const [key, value] of Object.entries(option)) {
    agent.set(key, value)
  }

  return agent
}

describe('Api Key', () => {
  let connection
  // connect to database mongodb (redis)
  beforeAll(async () => {
    const connectionString = `mongodb://${host}:${port}/${name}`
    connection = await mongoose.connect(connectionString)
  })
  beforeEach(async () => {
    await apiKeyModel.deleteMany({})
    await apiKeyModel.create(apiKeyTest)
  })

  // close connection to mongodb
  afterAll(async () => {
    await connection.disconnect()
  })

  it('should return status 403 when  miss x-api-key', async () => {
    const response = await getApiKey()
    const { body } = response
    expect(body.status).toBe(403)
  })

  it('should return message Access denied. ApiKey is required !!, when miss x-api-key', async () => {
    const response = await getApiKey()
    const { body } = response
    expect(body.message).toBe('Access denied. ApiKey is required !!')
  })

  it('should return status 403, when x-api-key not existed', async () => {
    const option = { 'x-api-key': 'false' }

    const response = await getApiKey(option)
    const { body } = response

    expect(body.status).toBe(403)
  })

  it('should return message Access denied. ApiKey not exist!!, when x-api-key not existed', async () => {
    const option = { 'x-api-key': 'false' }

    const response = await getApiKey(option)
    const { body } = response

    expect(body.message).toBe('Access denied. ApiKey not exist!!')
  })

  it('should return status 403 when  miss x-device-id', async () => {
    const option = { 'x-api-key': apiKeyTest.key }
    const response = await getApiKey(option)
    const { body } = response
    expect(body.status).toBe(403)
  })

  it('should return message DeviceId is required !!!, when miss x-device-id', async () => {
    const option = { 'x-api-key': apiKeyTest.key }
    const response = await getApiKey(option)
    const { body } = response
    expect(body.message).toBe('DeviceId is required !!!')
  })

  it('should return status 200, when valid request', async () => {
    const response = await getApiKey(validHeader)
    const { body } = response

    expect(body.status).toBe(200)
  })

  it('should return message ApiKey detail, when valid request', async () => {
    const response = await getApiKey(validHeader)
    const { body } = response

    expect(body.message).toBe('ApiKey detail')
  })

  it('should return key === value of x-api-key, when valid request', async () => {
    const response = await getApiKey(validHeader)
    const { body } = response

    expect(body.data.key).toEqual(apiKeyTest.key)
  })

  it('should return expected field, when valid request', async () => {
    const response = await getApiKey(validHeader)
    const { body } = response
    const expectedField = ['_id', 'key', 'permissions', 'createdBy', 'modifiedBy', 'createdDate', 'modifiedDate']

    expect(Object.keys(body.data).sort()).toEqual(expectedField.sort())
    expect(mongoose.Types.ObjectId.isValid(body.data._id)).toBe(true)
    expect(Array.isArray(body.data.permissions)).toBe(true)
  })
})
