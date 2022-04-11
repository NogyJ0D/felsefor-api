const config = require('../config')
const stripe = require('stripe')(config.stripeSK)

// ARCHIVO NO USADO, LO DEJO PARA FUTURA REFERENCIA

class Customers {
  async getById (id) {
    try {
      const data = await stripe.customers.retrieve(id)
      return {
        id: data.id,
        address: data.address,
        currency: data.currency,
        email: data.email,
        name: data.name,
        preferred_locales: data.preferred_locales
      }
    } catch (err) { return { fail: true, message: 'Ese consumidor no está registrado.' } }
  }
}

module.exports = Customers
