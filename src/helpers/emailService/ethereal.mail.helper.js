const nodemailer = require('nodemailer')

class EtherealMailer {
  constructor() {
    this.transporter = null
  }

  createAccount = async () => {
    const testAccount = await nodemailer.createTestAccount()
    return testAccount
  }

  createTransporter = async () => {
    const testAccount = await this.createAccount()

    this.transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
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

// module.exports = new EtherealMailer()

const emailService = new EtherealMailer()

emailService.sendMail()
