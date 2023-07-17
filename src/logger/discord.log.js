'use strict'

const { Client, GatewayIntentBits } = require('discord.js')

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

const token = 'MTEzMDQ0MjY0MTQ4MjQ1MzAzMg.GAAcVe.hGGXknZBu5RQXH1wOJltfIVy_5-b7O6h348r5U'
client.login(token)

client.on('messageCreate', (msg) => {
  if (msg.author.bot) return
  if (msg.content === 'hello') {
    msg.reply('Hello! Your Bot are already')
  }
})
