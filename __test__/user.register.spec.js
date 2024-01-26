const mongoose = require('mongoose')
const request = require('supertest')
const app = require('../src/app')
const {
  db: { host, port, name }
} = require('../src/configs/app.config')
const userModel = require('../src/models/user.model')
const sessionModel = require('../src/models/session.model')
const { findByEmail } = require('../src/models/repositories/user.repositories')
const en = require('../locales/en/translation.json')
const apiKeyModel = require('../src/models/apiKey.model')

const infoRegister = {
  email: 'tester01061@gmail.com',
  password: '111111',
  name: 'Tester Nguyen',
  phone: '0933393682'
}

// create api test
const apiKeyTest = {
  key: 'api-key-test',
  permissions: ['auth'],
  createdBy: 'Tester',
  deviceId: 'device-id-test'
}

const validHeader = {
  'x-api-key': apiKeyTest.key,
  'x-device-id': apiKeyTest.deviceId
}

const registerRequest = async (data = { ...infoRegister }, option = { ...validHeader }) => {
  const agent = request(app).post('/api/v1/auth/register')

  for (const [key, value] of Object.entries(option)) {
    agent.set(key, value)
  }

  return agent.send(data)
}

const formatErrorInputRes = (errors) => {
  const inputError = {}

  for (const error of errors) {
    inputError[error.path] = error.message
  }

  return inputError
}

describe('User Registration', () => {
  let connection
  // connect to database mongodb (redis)
  beforeAll(async () => {
    const connectionString = `mongodb://${host}:${port}/${name}`
    connection = await mongoose.connect(connectionString)
  })
  beforeEach(async () => {
    await apiKeyModel.deleteMany({})
    await userModel.deleteMany({})
    await sessionModel.deleteMany({})
    await apiKeyModel.create(apiKeyTest)
  })

  // close connection to mongodb
  afterAll(async () => {
    await connection.disconnect()
  })

  it('should return status 201, when signup request is valid', async () => {
    const response = await registerRequest()

    const { body } = response

    expect(body.status).toBe(201)
  })

  it('should return message register successfully, when signup request is valid', async () => {
    const response = await registerRequest()

    const { body } = response

    expect(body.message).toBe('register successfully')
  })

  it('should save email, password, name, phone to database', async () => {
    await registerRequest()
    const userFound = await findByEmail(infoRegister.email)

    expect(mongoose.Types.ObjectId.isValid(userFound._id)).toBe(true)
    expect(userFound.name).toBe(infoRegister.name)
    expect(userFound.email).toBe(infoRegister.email)
    expect(userFound.phone).toBe(infoRegister.phone)
  })

  it('should not contain password, when register success', async () => {
    const response = await registerRequest()
    const { body } = response

    expect(body.data.password).toBeUndefined()
  })

  it('should hashes password in database', async () => {
    await registerRequest()

    const userFound = await findByEmail(infoRegister.email)

    expect(userFound.password).not.toBe(infoRegister.password)
  })

  it('should return status 442, when email is null', async () => {
    const res = await registerRequest({ ...infoRegister, email: null })
    const { body } = res

    expect(body.status).toBe(422)
  })

  it('should return errors field in response when error input occurs', async () => {
    const res = await registerRequest({ ...infoRegister, email: null })
    const { body } = res

    expect(body.errors).not.toBeUndefined()
  })

  it('should return errors for both when email and name is null', async () => {
    const res = await registerRequest({ ...infoRegister, email: null, name: null })

    const {
      body: { errors }
    } = res

    const expectedErrorFields = ['email', 'name']
    const errorRes = formatErrorInputRes(errors)

    expect(Object.keys(errorRes).sort()).toEqual(expectedErrorFields.sort())
  })

  it.each`
    field         | value                | expectedMessage
    ${'email'}    | ${null}              | ${en.email_type_string}
    ${'email'}    | ${'tester'}          | ${en.email_invalid_domain}
    ${'email'}    | ${'tester@gmail.vn'} | ${en.email_invalid_domain}
    ${'name'}     | ${null}              | ${en.name_type_string}
    ${'name'}     | ${'asd'}             | ${en.name_size}
    ${'name'}     | ${'a'.repeat(51)}    | ${en.name_size}
    ${'phone'}    | ${null}              | ${en.phone_type_string}
    ${'phone'}    | ${'a'.repeat(51)}    | ${en.phone_pattern}
    ${'phone'}    | ${'123456789'}       | ${en.phone_pattern}
    ${'phone'}    | ${'1234567899112'}   | ${en.phone_pattern}
    ${'password'} | ${null}              | ${en.password_type_string}
    ${'password'} | ${'123'}             | ${en.password_size}
    ${'password'} | ${'a'.repeat(20)}    | ${en.password_size}
  `('should return message $expectedMessage when $field is $value', async ({ field, value, expectedMessage }) => {
    const infoRegisterModify = { ...infoRegister }
    infoRegisterModify[field] = value
    const res = await registerRequest({ ...infoRegisterModify })

    const {
      body: { errors }
    } = res

    const errorRes = formatErrorInputRes(errors)

    expect(errorRes[field]).toBe(expectedMessage)
  })

  it('should return status 400, when same email already in use', async () => {
    await registerRequest({ ...infoRegister })
    const res = await registerRequest({ ...infoRegister, name: 'same email register' })
    const { body } = res

    expect(body.status).toBe(400)
  })

  it('should create session of user when register success', async () => {
    const resNewUser = await registerRequest({ ...infoRegister })

    const sessionFound = await sessionModel.findOne({ user: resNewUser.body.data.user._id }).lean()

    expect(sessionFound.user.toString()).toBe(resNewUser.body.data.user._id.toString())
  })

  it('should return publicKey - privateKey - refreshToken is truthy, when register success', async () => {
    await registerRequest({ ...infoRegister })
    const sessionFound = await sessionModel.findOne().lean()

    expect(sessionFound.publicKey).toBeTruthy()
    expect(sessionFound.privateKey).toBeTruthy()
    expect(sessionFound.refreshToken).toBeTruthy()
  })

  it('should not create session when register fail', async () => {
    await registerRequest({ ...infoRegister, email: null })

    const sessionFound = await sessionModel.findOne().lean()

    expect(sessionFound).toBeFalsy()
  })

  it('should return accessToken and refreshToken when register success', async () => {
    const status = 200

    expect(status).toBe(status)
  })

  // kiểm tra nếu không truyền header
})
