const mongoose = require('mongoose')
const {
  db: { host, port, name, url }
} = require('../src/configs/app.config')

const connectionString = url || `mongodb://${host}:${port}/${name}`

const TestSchema = new mongoose.Schema({ name: String })
const TestModel = mongoose.model('Test', TestSchema)

describe('Mongoose Connection', () => {
  let connection

  beforeAll(async () => {
    connection = await mongoose.connect(connectionString)
    await TestModel.deleteMany({})
  })

  // close connection to mongodb
  afterAll(async () => {
    await connection.disconnect()
  })

  it('should connect to mongoose', () => {
    expect(mongoose.connection.readyState).toBe(1)
  })

  it('should save a document to database', async () => {
    const user = new TestModel({ name: 'jest' })
    await user.save()
    expect(user.isNew).toBe(false)
  })

  it('should find a document to the database', async () => {
    const user = await TestModel.findOne({ name: 'jest' })
    expect(user).toBeDefined()
    expect(user.name).toBe('jest')
  })
})
