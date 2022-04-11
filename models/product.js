const { mongoose } = require('../config/database')
const mongoosePaginate = require('mongoose-paginate-v2')

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Debes ingresar el nombre.']
  },

  description: {
    type: String,
    required: [true, 'Debes ingresar la descripción.']
  },

  active: {
    type: Boolean,
    default: true
  },

  unitPrice: {
    type: Number,
    required: [true, 'Debes ingresar el precio unitario.']
  },

  totalAmount: {
    type: Number,
    default: 0
  },

  categories: [{
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'categories'
  }],

  logoUrl: {
    type: String,
    default: '/files/product_placeholder.png'
  },

  stripeId: String
}, { timestamps: true })
productSchema.plugin(mongoosePaginate)

const CustomerModel = mongoose.model('products', productSchema)
module.exports = CustomerModel
