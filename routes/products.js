const express = require('express')
const { isProductManager } = require('../middlewares/auth')
const upload = require('../middlewares/upload')
const Product = require('../services/products')

const products = app => {
  const router = express.Router()
  const productService = new Product()
  app.use('/products', router)

  router.get('/all', async (req, res) => {
    const { filter, limit } = req.query
    let products

    if (filter === 'none') products = await productService.getAll(limit)
    else products = await productService.getByFilter(filter, limit)

    return res.status(200).json(products)
  })

  router.get('/id/:productId', async (req, res) => {
    const response = await productService.getProduct(req.params.productId)

    response.fail
      ? res.status(404).json(response)
      : res.status(201).json(response)
  })

  router.post('/', [isProductManager, upload.single('logo')], async (req, res) => {
    const response = await productService.create(req.body, req.file)

    response.fail
      ? res.status(400).json(response)
      : res.status(201).json(response)
  })

  router.put('/add-category/product-id/:productId', isProductManager, async (req, res) => {
    const response = await productService.addProductCategory(req.params.productId, req.body.idCategory)

    response.fail
      ? res.status(400).json(response)
      : res.status(200).json(response)
  })

  router.delete('/id/:productId', isProductManager, async (req, res) => {
    const response = await productService.deleteProduct(req.params.productId)

    response.fail
      ? res.status(400).json(response)
      : res.status(404).json()
  })
}

module.exports = products
