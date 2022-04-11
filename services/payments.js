const { stripeSK, stripeWebhookSecret } = require('../config')
const Customers = require('./customers')
const stripe = require('stripe')(stripeSK)

class Payments {
  constructor () {
    this.customers = new Customers()
  }

  async createIntent (data) {
    const customer = await this.customers.getById(data.customerId)
    if (customer.message) return customer

    const intent = await stripe.paymentIntents.create({
      amount: data.amount,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      customer: customer.id,
      receipt_email: customer.email
    })

    return intent.client_secret
  }

  createEvent (body, sign) {
    let event

    try {
      event = stripe.webhooks.constructEvent(body, sign, stripeWebhookSecret)

      if (event.type === 'payment_intent.succeeded') {
        return event.data.object
      } else return {}
    } catch (err) {
      return { fail: true, error: err.message }
    }
  }
}

module.exports = Payments
