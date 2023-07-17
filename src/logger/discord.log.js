'use strict'

const { Client, GatewayIntentBits } = require('discord.js')
const {
  discord: { token }
} = require('../configs/mongodb.config')

const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
})

client.on('ready', () => {
  console.log(`Logged is as ${client.user.tag}!`)
})

client.login(token)

client.on('messageCreate', (msg) => {
  if (msg.author.bot) return
  if (msg.content === 'hello') {
    msg.reply('Hello! Your Bot are already')
  }
})
