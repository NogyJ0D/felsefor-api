const { mongoose } = require('../config/database')

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Debes ingresar el nombre.']
  },

  description: {
    type: String,
    required: [true, 'Debes ingresar la descripción.']
  },

  items: [{
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'products'
  }]
}, { timestamps: true })

const CategoryModel = mongoose.model('categories', categorySchema)
module.exports = CategoryModel
