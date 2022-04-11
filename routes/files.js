const express = require('express')
const { downloadFile } = require('../libs/storage')

const files = (app) => {
  const router = new express.Router()
  app.use('/files', router)

  router.get('/:fileName', (req, res) => {
    const { fileName } = req.params
    downloadFile(fileName, res)
  })
}

module.exports = files
