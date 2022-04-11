const CategoryModel = require('../models/category')

class Categories {
  validate (error) {
    console.log(error)
    const errorMessages = Object.keys(error.errors).map(e => {
      const err = error.errors[e]
      return err.message
    })
    return { fail: true, message: errorMessages }
  }

  async getAll () {
    return await CategoryModel.find()
  }

  async getById (id) {
    return await CategoryModel.findOne({ _id: id })
  }

  async create (data) {
    try { return await new CategoryModel(data).save() } catch (err) { return this.validate(err) }
  }

  async addItem (id, itemId) {
    return await CategoryModel.findOneAndUpdate({ _id: id }, { $push: { items: itemId } }, { new: true })
  }

  async delItem (itemId) {
    return await CategoryModel.updateMany({ items: itemId }, { $pull: { items: itemId } })
  }
}

module.exports = Categories
