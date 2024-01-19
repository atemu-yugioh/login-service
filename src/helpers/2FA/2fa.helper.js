const { authenticator } = require('otplib')
const qrcode = require('qrcode')

const generateUniqueSecret = () => {
  return authenticator.generateSecret()
}

const generateOTPToken = (userId, serviceName, secret) => {
  return authenticator.keyuri(userId, serviceName, secret)
}

const generateQRCode = async (optAuth) => {
  let QRCodeImageUrl = ''
  try {
    QRCodeImageUrl = await qrcode.toDataURL(optAuth)

    return QRCodeImageUrl
  } catch (error) {
    console.log(error)
    return QRCodeImageUrl
  }
}

const verifyOTPToken = (token, secret) => {
  return authenticator.verify({ token, secret })
  // return authenticator.check(token, secret)
}
module.exports = {
  generateUniqueSecret,
  generateOTPToken,
  generateQRCode,
  verifyOTPToken
}
