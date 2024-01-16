const nodemailer = require('nodemailer')
const smtpServer = require('smtp-server')

const server = new smtpServer.SMTPServer({
  authOptional: true,
  onData(stream, session, callback) {
    let mailBody
    stream.on('data', (data) => {
      mailBody += data.toString()
    })
    stream.on('end', () => {
      console.log('Received email:')
      console.log(mailBody)
      callback()
    })
  }
})

// Lắng nghe trên cổng 25
server.listen(8587, '127.0.0.1', () => {
  console.log('SMTP server is listening on port 8587')
})

// Ngắt kết nối khi bạn kết thúc
process.on('SIGINT', () => {
  server.close(() => {
    console.log('SMTP server closed')
    process.exit(0)
  })
})

class SMTPMailer {
  constructor() {
    this.transporter = null
  }

  createAccount = async () => {
    return await nodemailer.createTestAccount()
  }

  createTransporter = async () => {
    this.transporter = nodemailer.createTransport({
      host: 'localhost',
      port: 8587,
      tls: {
        rejectUnauthorized: false
      }
    })
  }

  sendMail = async () => {
    if (!this.transporter) {
      await this.createTransporter()
    }

    try {
      const info = await this.transporter.sendMail({
        from: 'My App <info@my-app.com>',
        to: 'nguyenthieng0106@gmail.com',
        subject: 'Account Activation',
        text: 'This is a test email sent using Ethereal and Nodemailer.',
        html: `
            <div>
              <b>Please click below link to activate your account</b>
            </div>
            <div>
              <a href="http://localhost:3000">Activate</a>
            </div>
            `
      })

      console.log('Message sent: %s', info.messageId)
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
    } finally {
      this.closeTransporter()
    }
  }

  closeTransporter = () => {
    if (this.transporter) {
      this.transporter.close()
    }
  }
}

const emailService = new SMTPMailer()

emailService.sendMail()
