const express = require('express')
const cors = require('cors')
const path = require('path')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const { createStream } = require('rotating-file-stream')
const { port } = require('./config')
const cons = require('consolidate')

const app = express()

// Database
const { connection } = require('./config/database')
connection()

// View
// app.use(express.static(path.join(__dirname, '/public')))
app.engine('html', cons.swig)
app.set('views', path.join(__dirname, '/public'))
app.set('view engine', 'html')

// Importing routes
const paymentsRoutes = require('./routes/payments')
const authRoutes = require('./routes/auth')
const usersRoutes = require('./routes/users')
const productsRoutes = require('./routes/products')
const categoriesRoutes = require('./routes/categories')
const filesRoutes = require('./routes/files')

// Morgan
const rfsStream = createStream('./logs/log.json', {
  size: '300M',
  interval: '7d',
  compress: 'gzip'
})
app.use(morgan('[":method", ":url", ":status", ":response-time ms", ":date[iso]"]', { stream: rfsStream }))

// Middlewares
app.use('/payments/webhooks', express.raw({ type: 'application/json' }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors({
  credentials: true,
  origin: ['http://localhost:3000', 'http://localhost:4000']
}))

// Routing
paymentsRoutes(app)
authRoutes(app)
usersRoutes(app)
productsRoutes(app)
categoriesRoutes(app)
filesRoutes(app)

// Starting
app.get('/', (req, res) => {
  return res.json({ path: '/', routes: { auth: { base: '/auth', routes: ['/signup', '/login', '/validate'] } } })
})

app.get('/success', (req, res) => {
  return res.render('index')
})

app.listen(port, () => { console.log('Working on port', port) })
