import { SENDGRID_API_KEY } from '../config'

const sgMail = require('@sendgrid/mail')

export default function forgotPassword(email: string) {
  sgMail.setApiKey(SENDGRID_API_KEY)

  const msg = {
    to: email,
    from: 'noreply@musicmonkey.io',
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>'
  }
  sgMail.send(msg)
}
