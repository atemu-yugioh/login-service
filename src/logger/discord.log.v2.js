const { Client, GatewayIntentBits } = require('discord.js')
const {
  discord: { token, channel }
} = require('../configs/mongodb.config')

const logLevel = {
  error: 'e03116',
  warning: 'e0d316',
  debug: '00ff00',
  info: '168fe0'
}

class LoggerService {
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
      ]
    })

    // add channelId
    this.channelId = channel

    this.client.on('ready', () => {
      console.log(`Logger is running on tag:: ${this.client.user.tag}!`)
    })

    // login discord throught token
    this.client.login(token)
  }

  // send with format code
  sendToFormatCode(logData) {
    const {
      colorHex = logLevel.debug,
      code,
      message = 'This is some additional infomation about the code.',
      title = 'Code Example'
    } = logData

    const codeMessage = {
      content: message,
      embeds: [
        {
          color: parseInt(colorHex, 16), // Convert hexadecimal color to integer
          title,
          description: '```json\n' + JSON.stringify(code, null, 2) + '\n```'
        }
      ]
    }

    const channel = this.client.channels.cache.get(this.channelId)

    if (!channel) {
      console.log(`Not found channel discord...`, this.channelId)
      return
    }

    channel.send(codeMessage).catch((e) => console.log(e))
  }

  // sent message to channel
  sendToMessage(message = 'message') {
    // get channel (check channel exist)
    const channel = this.client.channels.cache.get(this.channelId)

    if (!channel) {
      console.log(`Couldn't find the channel...`, this.channelId)
      return
    }

    channel.send(message).catch((e) => console.log(e))
  }
}

module.exports = new LoggerService()
