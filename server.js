const app = require('./src/app')
const {
  app: { port }
} = require('./src/configs/config.mongodb')

const server = app.listen(port, () => {
  console.log('Server is running')
})

process.on('SIGINT', () => {
  server.close(() => {
    console.log('Server Exited')
  })
})
