const nodemailer = require('nodemailer')
const { emailHost, emailPort, emailSecure, emailUser, emailPassword } = require('../config')

const transporter = nodemailer.createTransport({
  host: emailHost,
  port: emailPort,
  secure: emailSecure,
  auth: {
    user: emailUser,
    pass: emailPassword
  }
})

const sendEmail = async (to, subject, text, html) => {
  await transporter.sendMail({
    from: 'valentingiarra2@gmail.com',
    to,
    subject,
    text,
    html
  })
  return { success: true }
}

module.exports = sendEmail
