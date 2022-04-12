const { stripeSK, stripeWebhookSecret } = require('../config')
const sendEmail = require('../libs/email')
const Carts = require('./carts')
const Customers = require('./customers')
const User = require('./users')
const stripe = require('stripe')(stripeSK)

class Payments {
  constructor () {
    this.customers = new Customers()
    this.users = new User()
    this.carts = new Carts()
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

  async createEvent (body, sign) {
    let event

    try {
      event = stripe.webhooks.constructEvent(body, sign, stripeWebhookSecret)

      if (event.type === 'payment_intent.succeeded') {
        console.log(event.data.object.customer)
        await this.confirmPayment(event.data.object.customer)
        return event.data.object
      } else return {}
    } catch (err) {
      return { fail: true, error: err.message }
    }
  }

  async confirmPayment (customerId) {
    const user = await this.users.getByFilter({ customerId })

    const { cart, totalPrice } = await this.carts.getByUserId(user._id)
    await this.carts.clearAndConfirm(user.cartId)

    await sendEmail(
      user.email,
      'Compra exitosa',
      '¡Gracias por comprar en fElseFor!',
      `<h1>¡Gracias por comprar en fElseFor!</h1>
      <br>
      <h3>Tus productos:</h3>
      </br>
      ${cart.products.map(prod => {
        return (
          `
            <div>
              <p>${prod.itemName}</p>
              <p>Cantidad: ${prod.quantity}</p>
              <p>Precio total: ${parseInt(prod.itemPrice) * prod.quantity}</p>
            </div>
            <hr>
          `
        )
      })}
      <br>
      <h3>Precio final: $${totalPrice} USD</h3>
      `
    )

    return {}
  }
}

module.exports = Payments
