const { mongoose } = require('../config/database')

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'users',
    unique: true,
    required: true
  },

  products: [{
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'products'
  }],

  totalPrice: {
    type: Number,
    default: 0
  }
}, { timestamps: true })

const CartModel = mongoose.model('carts', cartSchema)
module.exports = CartModel
