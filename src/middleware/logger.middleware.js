'use strict'
const asyncHandler = require('../helper/asyncHandler')
const Logger = require('../logger/discord.log.v2')

const pushToLogDiscord = asyncHandler(async (req, res, next) => {
  Logger.sendToFormatCode({
    title: `Method: ${req.method}`,
    code: req.method === 'GET' ? req.query : req.body,
    message: `$${req.get('host')}${req.originalUrl}`
  })

  return next()
})

module.exports = pushToLogDiscord
