const { Router } = require('express')
const { isAdmin } = require('../middlewares/auth')

const UsersServices = require('../services/users')
const users = app => {
  const router = Router()
  const usersService = new UsersServices()
  app.use('/users', router)

  router.get('/', isAdmin, async (req, res) => {
    return res.status(200).json(await usersService.getAll())
  })
}

module.exports = users
