const express = require('express')
const Category = require('../services/categories')
const { isProductManager } = require('../middlewares/auth')

const categories = app => {
  const router = express.Router()
  const categoryService = new Category()
  app.use('/categories', router)

  router.get('/', async (req, res) => {
    const response = await categoryService.getAll()
    return res.status(200).json(response)
  })

  router.post('/', isProductManager, async (req, res) => {
    const response = await categoryService.create(req.body)

    response.fail
      ? res.status(400).json(response)
      : res.status(200).json(response)
  })
}

module.exports = categories
