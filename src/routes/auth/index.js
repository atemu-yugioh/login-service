const express = require('express')
const router = express.Router()

router.post('/login', (req, res, next) => {
  return res.status(200).json({
    message: 'success',
    status: 200,
    data: null
  })
})

router.post('/register', (req, res, next) => {
  return res.status(200).json({
    message: 'success',
    status: 200,
    data: null
  })
})

router.post('/logout', (req, res, next) => {
  return res.status(200).json({
    message: 'success',
    status: 200,
    data: null
  })
})

router.post('/handle-refresh-token', (req, res, next) => {
  return res.status(200).json({
    message: 'success',
    status: 200,
    data: null
  })
})

module.exports = router
