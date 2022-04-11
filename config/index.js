require('dotenv').config()

const config = {
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  // Stripe
  stripePK: process.env.STRIPE_PK,
  stripeSK: process.env.STRIPE_SK,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SK,
  // Mongoose
  dbUsername: process.env.DB_USERNAME,
  dbPassword: process.env.DB_PASSWORD,
  dbHost: process.env.DB_HOST,
  dbName: process.env.DB_NAME,
  // Sendgrid
  emailHost: process.env.EMAIL_HOST,
  emailPort: process.env.EMAIL_PORT,
  emailSecure: process.env.EMAIL_SECURE,
  emailUser: process.env.EMAIL_USER,
  emailPassword: process.env.EMAIL_PASSWORD,
  // Passport
  callbackUrl: process.env.NODE_ENV === 'dev'
    ? process.env.CALLBACK_URL_DEVELOPMENT + ':' + process.env.PORT
    : process.env.CALLBACK_URL,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  // Files
  bucketName: process.env.BUCKET_NAME
}

module.exports = config
