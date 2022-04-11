const { Storage } = require('@google-cloud/storage')
const { Readable } = require('stream')
const { bucketName } = require('../config')
const uuid = require('uuid')
const path = require('path')

const storage = new Storage({ keyFilename: 'credentials-gcloud.json' })

const uploadFile = (fileName, buffer) => {
  if (!fileName || !buffer) return { success: false, message: 'Se requiere un archivo.' }

  const ext = path.extname(fileName)
  const uuidFileName = uuid.v4() + ext

  const file = storage.bucket(bucketName).file(uuidFileName)
  const stream = Readable.from(buffer)

  return new Promise((resolve, reject) => {
    stream
      .pipe(file.createWriteStream())
      .on('finish', () => {
        resolve({
          success: true,
          message: 'El archivo fue cargado exitosamente.',
          fileName: uuidFileName
        })
      })
      .on('error', (err) => {
        console.log(err)
        reject({ success: false, message: err })
      })
  })
}

const downloadFile = (fileName, res) => {
  const file = storage.bucket(bucketName).file(fileName)
  const stream = file.createReadStream()
    .on('error', (err) => {
      if (err.code === 404) res.status(404).json({ success: false, message: 'No se encontró el archivo.' })
    })
  stream.pipe(res)
}

module.exports = { uploadFile, downloadFile }
