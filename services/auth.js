const Users = require('./users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { jwtSecret } = require('../config')
// const UserModel = require('../models/user')
const sendEmail = require('../libs/email')
const { uploadFile } = require('../libs/storage')

class Auth {
  constructor () {
    this.users = new Users()
  }

  getToken (user) {
    const data = {
      username: user.username,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      id: user.id,
      role: user.role,
      profile_pic: user.logoUrl,
      customerId: user.customerId,
      address: user.address
    }
    const token = jwt.sign({ username: data.username, email: data.email, id: data.id, role: data.role }, jwtSecret, { expiresIn: '7d' })
    return { data, token }
  }

  async signup (userData, file) {
    if (await this.users.getByFilter({ email: userData.email })) {
      return { fail: true, message: 'Este email ya está en uso' }
    } else if (await this.users.getByFilter({ username: userData.username })) {
      return { fail: true, message: 'Este nombre de usuario ya está en uso.' }
    }

    let uploaded
    if (file) uploaded = await uploadFile(file?.originalname, file?.buffer)
    if (uploaded?.success) {
      userData.fileKey = uploaded.fileName
      userData.logoUrl = `/files/${uploaded.fileName}`
    }

    const salt = await bcrypt.genSalt(10)
    userData.role = 0
    userData.password = await bcrypt.hash(userData.password, salt)

    const user = await this.users.create(userData)
    if (user.fail) return user

    const emailToken = jwt.sign({ id: user._id, role: 0 }, jwtSecret, { expiresIn: '1d' })
    await sendEmail(
      user.email,
      'Registro exitoso',
      '¡Gracias por entrar a fElseFor!',
      `<h1>¡Gracias por entrar a fElseFor!</h1>
      <br>
      <a href='http://localhost:4000/auth/email/${emailToken}'>Valida tu email</a>`
    )

    return this.getToken(user)
  }

  async emailValidate (token) {
    try {
      const { id, role } = jwt.verify(token, jwtSecret)
      if (role === 0) return this.users.update(id, { role: 1 })
      else return { fail: true, message: 'Tu email ya fue validado.' }
    } catch (err) { return { fail: true, message: err } }
  }

  async login (email, password) {
    if (!email || !password) return { fail: true, message: 'Ingresa ambas credenciales.' }

    const user = await this.users.getByFilter({ email })

    if (user?.idProvider) return { fail: true, message: 'Debes iniciar con el botón de Google.' }
    else if (user) {
      const realPassword = await bcrypt.compare(password, user.password)
      if (realPassword) return this.getToken(user)
      else return { fail: true, message: 'Las credenciales no coinciden.' }
    } else return { fail: true, message: 'El usuario no existe.' }
  }

  async loginProvider (profile) {
    let user = await this.users.getByFilter({ idProvider: profile.idProvider })

    if (!user) user = await this.users.create(profile)
    return this.getToken(user)
  }

  async validateUser (data) {
    const user = await this.users.getByFilter({ email: data.email })
    return this.getToken(user)
  }
}

module.exports = Auth
