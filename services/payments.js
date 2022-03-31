const { stripeSK } = require('../config')

const stripe = require('stripe')(stripeSK)

class Payments {
  async createIntent (amount) {
    const intent = await stripe.paymentIntents.create({
      amount, currency: 'usd'
    })

    console.log(intent)
    return intent.client_secret
  }
}

module.exports = Payments
