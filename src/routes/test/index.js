const express = require('express')

const router = express.Router()

router.get('/get', (req, res, next) => {
  return res.status(200).json({
    message: 'get test success',
    statusCode: 200
  })
})

router.post('/post', (req, res, next) => {
  return res.status(200).json({
    message: 'post test success',
    statusCode: 200
  })
})

module.exports = router
