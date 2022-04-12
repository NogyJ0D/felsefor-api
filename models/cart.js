const { mongoose } = require('../config/database')

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'users',
    unique: true,
    required: true
  },

  products: [{
    itemId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'products'
    },

    quantity: {
      type: Number,
      default: 1
    },

    itemName: String,

    itemPrice: String,

    itemLogo: String
  }]
}, { timestamps: true })

const CartModel = mongoose.model('carts', cartSchema)
module.exports = CartModel
