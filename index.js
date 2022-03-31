const express = require('express')
const cors = require('cors')
const path = require('path')
const morgan = require('morgan')
const { createStream } = require('rotating-file-stream')
const { port } = require('./config')

const paymentsRoutes = require('./routes/payments')

const app = express()

const rfsStream = createStream('./logs/log.json', {
  size: '300M',
  interval: '7d',
  compress: 'zip'
})
app.use(morgan('[":method", ":url", ":status", ":response-time ms", ":date[iso]"]', { stream: rfsStream }))

app.use(express.static(path.join(__dirname, '/public')))
app.use(express.json())
app.use(cors({
  credentials: false,
  origin: ['http://localhost:3000']
}))

paymentsRoutes(app)

app.get('/', (req, res) => {
  return res.render('index')
})

app.listen(port, () => { console.log('Working on port', port) })
