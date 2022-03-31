require('dotenv').config()

const config = {
  port: process.env.PORT,
  stripePK: process.env.STRIPE_PK,
  stripeSK: process.env.STRIPE_SK
}

module.exports = config
