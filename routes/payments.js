const express = require('express')
const Payments = require('../services/payments')

const payments = app => {
  const router = express.Router()
  const pay = new Payments()
  app.use('/payments', router)

  router.post('/create-intent', async (req, res) => {
    const intent = await pay.createIntent(req.body)

    return res.json({ clientSecret: intent })
  })

  router.post('/webhooks', async (req, res) => {
    const sign = req.headers['stripe-signature']

    const result = await pay.createEvent(req.body, sign)

    result.fail
      ? res.status(400).send()
      : result.paymentIntent
        ? res.status(200).json(result)
        : res.status(200).send()
  })
}

module.exports = payments
