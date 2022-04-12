const CartModel = require('../models/cart')
const ProductsServices = require('./products')

class Carts {
  constructor () {
    this.products = new ProductsServices()
  }

  async getAll () {
    return await CartModel.find()
  }

  async getByUserId (id) {
    if (!id) return { fail: true, message: 'Ingrese el id del usuario.' }

    const cart = await CartModel.findOne({ userId: id })
    if (!cart) return { fail: true, message: '' }

    let totalPrice = 0
    cart.products.forEach(prod => {
      totalPrice += parseInt(prod.itemPrice) * prod.quantity
    })

    return { cart, totalPrice }
  }

  async create (userId) {
    if (!userId) return { fail: true, message: 'Ingrese el id del usuario.' }

    try {
      return await new CartModel({
        userId,
        items: []
      })
        .save()
    } catch (err) {
      return { fail: true, message: err }
    }
  }

  async addItem (id, data) {
    if (!id || !data) return { fail: true, message: 'Llene los campos.' }

    try {
      const cart = await CartModel.findOne({ _id: id })
      if (!cart) return { fail: true, message: 'No existe ese carrito.' }

      const productExists = cart.products.find(prod => prod.itemId.equals(data.itemId))

      let newCart
      if (productExists) {
        const newQuantity = productExists.quantity + parseInt(data.quantity)

        newCart = await CartModel.findOneAndUpdate({ _id: id, 'products.itemId': productExists.itemId }, { $set: { 'products.$.quantity': newQuantity } }, { new: true })
      } else {
        newCart = await CartModel.findOneAndUpdate({ _id: id }, { $push: { products: data } }, { new: true })
      }

      let totalPrice = 0
      newCart.products.forEach(prod => {
        totalPrice += parseInt(prod.itemPrice) * prod.quantity
      })

      console.log(newCart, totalPrice)
      await this.products.reduceProductAmount(data.itemId, data.quantity)
      return { newCart, totalPrice }
    } catch (err) {
      return { fail: true, message: err }
    }
  }

  async reduceItem (id, data) {
    if (!id || !data) return { fail: true, message: 'Llene los campos.' }

    try {
      const cart = await CartModel.findOne({ _id: id })
      if (!cart) return { fail: true, message: 'No existe ese carrito.' }

      const product = cart.products.find(prod => prod.itemId.equals(data.itemId))
      if (!product) return { fail: true, message: 'Tu carrito no contiene ese item.' }

      const newQuantity = product.quantity - parseInt(data.quantity)
      if (newQuantity === 0) return this.delItem(id, product.itemId)

      await this.products.increaseProductAmount(data.itemId, data.quantity)
      const newCart = await CartModel.findOneAndUpdate({ _id: id, 'products.itemId': product.itemId }, { $set: { 'products.$.quantity': newQuantity } }, { new: true })

      let totalPrice = 0
      newCart.products.forEach(prod => {
        totalPrice += parseInt(prod.itemPrice) * prod.quantity
      })

      return { newCart, totalPrice }
    } catch (err) {
      return { fail: true, message: err }
    }
  }

  async delItem (idCart, itemId) {
    if (!idCart || !itemId) return { fail: true, message: 'Llene los campos.' }

    try {
      const cart = await CartModel.findOne({ _id: idCart })
      if (!cart) return { fail: true, message: 'No existe ese carrito.' }

      const product = cart.products.find(prod => prod.itemId.equals(itemId))
      if (!product) return { fail: true, message: 'Tu carrito no contiene ese item.' }

      await this.products.increaseProductAmount(itemId, product.quantity)
      const newCart = await CartModel.findOneAndUpdate({ _id: idCart }, { $pull: { products: { itemId } } }, { new: true })

      let totalPrice = 0
      newCart.products.forEach(prod => {
        totalPrice += parseInt(prod.itemPrice) * prod.quantity
      })

      return { newCart, totalPrice }
    } catch (err) {
      return { fail: true, message: err }
    }
  }

  async clearAndConfirm (cartId) {
    if (!cartId) return { fail: true, message: 'Llene los campos.' }

    const cart = await CartModel.findOne({ _id: cartId })

    cart.products.forEach(async prod => {
      await this.products.increaseProductAmount(prod.itemId, prod.quantity)
      await this.products.reduceProductAmount(prod.itemId, prod.quantity)
    })

    const newCart = await CartModel.findOneAndUpdate({ _id: cartId }, { $set: { products: [] } }, { new: true })
    return { newCart, totalPrice: 0 }
  }
}

module.exports = Carts
