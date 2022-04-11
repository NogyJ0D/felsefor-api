const { stripeSK } = require('../config')
const UserModel = require('../models/user')
const stripe = require('stripe')(stripeSK)
const CartServices = require('./carts')

class Users {
  constructor () {
    this.carts = new CartServices()
  }

  validate (error) {
    // console.log(error)
    const errorMessages = Object.keys(error.errors).map(e => {
      const err = error.errors[e]
      if (err.kind === 'unique') return 'Ya existe un usuario con ese nombre, intente con otro.'
      return err.properties.message
    })
    return { fail: true, message: errorMessages }
  }

  getAll () {
    return UserModel.find()
  }

  getByFilter (filter) {
    return UserModel.findOne(filter)
  }

  async create (data) {
    const user = new UserModel(data)

    const customerData = {
      address: {
        city: user.address.city,
        country: user.address.country,
        line1: user.address.line1,
        postal_code: user.address.postal_code,
        state: user.address.state
      },
      email: user.email,
      name: `${user.lastname}, ${user.firstname}`,
      metadata: {
        db_id: user._id
      },
      preferred_locales: ['es']
    }

    const validation = user.validateSync()
    if (validation) return this.validate(validation)

    const cart = await this.carts.create(user._id)
    user.cartId = cart._id

    const customer = await stripe.customers.create(customerData)
    user.customerId = customer.id

    return await user.save()
  }

  async update (id, data) {
    return UserModel.findOneAndUpdate({ _id: id }, data, { new: true, runValidators: true })
      .then(res => {
        if (!res) { return { success: false, message: 'Ese usuario no existe.' } } else return res
      })
      .catch(err => { return this.validate(err) })
  }
}

module.exports = Users
