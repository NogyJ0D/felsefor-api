const express = require('express')
const { isConsumer } = require('../middlewares/auth')
const CartsServices = require('../services/carts')

const carts = (app) => {
  const cartService = new CartsServices()
  const router = new express.Router()
  app.use('/carts', router)

  router.get('/user-id/:userId', async (req, res) => {
    const response = await cartService.getByUserId(req.params.userId)

    return res.status(200).json(response)
  })

  // Solo para pruebas
  router.post('/', async (req, res) => {
    const response = await cartService.create(req.body.userId)

    response.fail
      ? res.status(400).json(response)
      : res.status(201).json(response)
  })

  router.put('/add-item/cart-id/:cartId', isConsumer, async (req, res) => {
    const data = {
      itemId: req.body.itemId,
      itemName: req.body.itemName,
      quantity: req.body.quantity,
      itemPrice: req.body.itemPrice,
      itemLogo: req.body.itemLogo
    }

    const response = await cartService.addItem(req.params.cartId, data)

    response.fail
      ? res.status(400).json(response)
      : res.status(200).json(response)
  })

  router.put('/reduce-item/cart-id/:cartId', isConsumer, async (req, res) => {
    const data = {
      itemId: req.body.itemId,
      quantity: req.body.quantity
    }

    const response = await cartService.reduceItem(req.params.cartId, data)

    response.fail
      ? res.status(400).json(response)
      : res.status(200).json(response)
  })

  router.delete('/delete-item/cart-id/:cartId', isConsumer, async (req, res) => {
    const response = await cartService.delItem(req.params.cartId, req.body.itemId)

    response.fail
      ? res.status(400).json(response)
      : res.status(404)
  })
}

module.exports = carts
