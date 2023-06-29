const express = require('express')
const router = express.Router()

router.get('', (req, res, next) => {
  return res.status(200).json({
    status: 200,
    message: 'success',
    data: null
  })
})

module.exports = router
