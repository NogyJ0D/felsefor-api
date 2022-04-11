const { Router } = require('express')
const passport = require('passport')
const { useGoogleStrategy, isNew } = require('../middlewares/auth')
const tokenCookie = require('../helpers/tokenCookie')
const upload = require('../middlewares/upload')

const AuthServices = require('../services/auth')
const auth = app => {
  const router = Router()
  const authService = new AuthServices()
  app.use('/auth', router)

  router.use(passport.initialize())
  passport.use(useGoogleStrategy())
  passport.serializeUser((user, done) => {
    done(null, user)
  })

  router.post('/signup', upload.single('logo'), async (req, res) => {
    const response = await authService.signup(req.body, req.file)

    response.fail
      ? res.status(400).json(response)
      : tokenCookie(res, response)
  })

  router.get('/email/:token', async (req, res) => {
    const response = await authService.emailValidate(req.params.token)

    response.fail
      ? res.status(400).json(response)
      : res.redirect('/success')
  })

  router.post('/login', async (req, res) => {
    const { email, password } = req.body
    const response = await authService.login(email, password)

    response.fail
      ? res.status(400).json(response)
      : tokenCookie(res, response)
  })

  router.post('/logout', (req, res) => {
    return res.cookie('token', '', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      expires: new Date()
    }).json({ loggedOut: true })
  })

  router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }))
  router.get('/google/callback', passport.authenticate('google'), async (req, res) => {
    const profile = {
      username: req.user.profile.displayName,
      firstname: req.user.profile.name.givenName,
      lastname: req.user.profile.name.familyName,
      email: req.user.profile.emails[0].value || null,
      role: 1,
      logoUrl: req.user.profile.photos[0].value || null,
      provider: req.user.profile.provider,
      idProvider: req.user.profile.id
    }
    const response = await authService.loginProvider(profile)

    return tokenCookie(res, response)
  })

  router.post('/validate', isNew, async (req, res) => {
    const response = await authService.validateUser(req.user)
    return tokenCookie(res, response)
  })
}

module.exports = auth
