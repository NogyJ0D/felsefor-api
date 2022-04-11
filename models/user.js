const { mongoose } = require('../config/database')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Ingrese su nombre de usuario.'],
    unique: true,
    maxlength: [16, 'Su nombre de usuario no puede tener mas de 16 caracteres.']
  },

  firstname: {
    type: String,
    required: [true, 'Ingrese su nombre'],
    maxlength: [32, 'Su nombre no puede tener mas de 32 caracteres.']
  },

  lastname: {
    type: String,
    required: [true, 'Ingrese Su apellido.'],
    maxlength: [32, 'Su apellido no puede tener mas de 32 caracteres.']
  },

  email: {
    type: String,
    required: [true, 'Ingrese su email.'],
    unique: true,
    maxlength: [120, 'Su email no puede tener mas de 120 caracteres.'],
    lowercase: true
  },

  password: String,

  role: {
    type: Number,
    enum: [[0, 1, 2, 3, 4], 'Su rol debe ser 0, 1, 2, 3 o 4.']
  },

  fileKey: {
    type: String,
    default: 'user_profile_pic.png'
  },
  logoUrl: {
    type: String,
    default: '/files/user_profile_pic.png'
  },

  customerId: String,

  address: {
    required: [true, 'Ingrese los datos de su dirección.'],
    type: {
      city: {
        type: String,
        required: [true, 'Ingrese su ciudad.']
      },

      country: {
        type: String,
        required: [true, 'Ingrese su país.']
      },

      line1: {
        type: String,
        required: [true, 'Ingrese su dirección.']
      },

      postal_code: {
        type: String,
        required: [true, 'Ingrese su código postal.']
      },

      state: {
        type: String,
        required: [true, 'Ingrese su estado/provincia.']
      }
    }
  },

  cartId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'carts'
  },

  provider: String,
  idProvider: String
}, { timestamps: true })
userSchema.plugin(uniqueValidator)

const UserModel = mongoose.model('users', userSchema)
module.exports = UserModel
