const app = require('./src/app')

const server = app.listen(3002, () => {
  console.log('Server is running')
})

process.on('SIGINT', () => {
  server.close(() => {
    console.log('Server Exited')
  })
})
