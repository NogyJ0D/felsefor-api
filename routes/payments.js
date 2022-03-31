const { Router } = require('express')
const Payments = require('../services/payments')

const payments = app => {
  const router = Router()
  const pay = new Payments()
  app.use('/payments', router)

  router.post('/intent', async (req, res) => {
    const intent = await pay.createIntent(req.body.amount)

    return res.json({
      clientSecret: intent
    })
  })
}

module.exports = payments
