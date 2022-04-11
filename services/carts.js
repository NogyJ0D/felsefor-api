const CartModel = require('../models/cart')

class Carts {
  async getAll () {
    return await CartModel.find()
  }

  async getByUserId (id) {
    return await CartModel.findOne({ userId: id })
  }

  async create (userId) {
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

  async addItem (id, itemId) {
    return await CartModel.findOneAndUpdate({ userId: id }, { $push: { items: itemId } }, { new: true })
  }

  async delItem (itemId) {
    return await CartModel.updateMany({ items: itemId }, { $pull: { items: itemId } })
  }
}

module.exports = Carts
