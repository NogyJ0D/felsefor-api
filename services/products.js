const { stripeSK } = require('../config')
const { uploadFile } = require('../libs/storage')
const Category = require('./categories')
const ProductModel = require('../models/product')
const stripe = require('stripe')(stripeSK)

class Products {
  constructor () {
    this.categories = new Category()
  }

  validate (error) {
    // console.log(error)
    const errorMessages = Object.keys(error.errors).map(e => {
      const err = error.errors[e]
      return err.properties.message
    })
    return { fail: true, message: errorMessages }
  }

  async getAll (limit, page) {
    return await ProductModel.paginate({}, { limit, page, populate: { path: 'categories', select: 'name' } })
  }

  async getByFilter (filter, limit, page) {
    return await ProductModel.paginate({ categories: filter }, { limit, page, populate: { path: 'categories', select: 'name' } })
  }

  async create (data, file) {
    if (!data.name || !data.description || !data.unitPrice) return { fail: true, message: 'Debes ingresar nombre, descripción y precio unitario.' }

    data.logoUrl = '/files/product_placeholder.png'
    let uploaded
    if (file) uploaded = await uploadFile(file?.originalname, file?.buffer)
    if (uploaded?.success) {
      data.logoUrl = `/files/${uploaded.fileName}`
    }

    const productData = {
      name: data.name,
      description: data.description,
      unitPrice: data.unitPrice,
      totalAmount: data.totalAmount,
      categories: data.categories,
      logoUrl: data.logoUrl
    }

    const newProduct = new ProductModel(productData)

    const validation = newProduct.validateSync()
    if (validation) return this.validate(validation)

    const stripeProduct = await stripe.products.create({
      name: data.name,
      description: data.description,
      metadata: {
        unitPrice: data.unitPrice,
        totalAmount: data.totalAmount,
        logoUrl: data.logoUrl,
        dbId: newProduct._id
      }
    })
    newProduct.stripeId = stripeProduct.id

    return await newProduct.save()
  }

  async getProduct (id) {
    const product = await ProductModel.findOne({ _id: id }).populate('categories name')

    if (!product) return { fail: true, message: 'Ese producto no existe.' }
    return product
  }

  async addProductCategory (id, idCategory) {
    if (!id || !idCategory) return { fail: true, message: 'Ingrese los parámetros.' }

    const product = await ProductModel.findOne({ _id: id })
    if (!product) return { fail: true, message: 'Ese producto no existe.' }
    else if (product.categories.includes(idCategory)) return { fail: true, message: 'El producto ya tiene esa categoría.' }

    const category = await this.categories.getById(idCategory)
    if (!category) return { fail: true, message: 'Esa categoría no existe.' }
    else if (category.items.includes(id)) return { fail: true, message: 'La categoría ya contiene ese producto.' }

    await this.categories.addItem(idCategory, id)
    return await ProductModel.findOneAndUpdate({ _id: id }, { $push: { categories: idCategory } }, { new: true })
  }

  async deleteProduct (id) {
    if (!id) return { fail: true, message: 'Ingrese el id del producto.' }

    const exists = await ProductModel.findOne({ _id: id })
    if (!exists) return { fail: true, message: 'Ese producto no existe.' }

    await stripe.products.del(exists.stripeId)
    await this.categories.delItem(id)
    return await ProductModel.findByIdAndDelete(id)
  }

  async reduceProductAmount (id, amount) {
    if (!id || !amount) return { fail: true, message: 'Ingrese los datos.' }

    const product = await ProductModel.findById(id)
    const newAmount = product.totalAmount - amount
    return await ProductModel.findOneAndUpdate({ _id: id }, { $set: { totalAmount: newAmount } })
  }

  async increaseProductAmount (id, amount) {
    if (!id || !amount) return { fail: true, message: 'Ingrese los datos.' }

    const product = await ProductModel.findById(id)
    const newAmount = product.totalAmount + amount
    return await ProductModel.findOneAndUpdate({ _id: id }, { $set: { totalAmount: newAmount } })
  }
}

module.exports = Products
