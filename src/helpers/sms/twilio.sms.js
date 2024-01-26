const accountSid = 'ACb8bc0ef9db95e04223868e1dfa266518'
const authToken = '12a6196370131cf625f05cd024706343'
const client = require('twilio')(accountSid, authToken)

client.messages
  .create({
    body: 'dashed',
    from: '+12062027469',
    to: '+840337410055'
  })
  .then((message) => console.log(message.sid))
