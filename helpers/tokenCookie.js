const tokenCookie = (res, data) => {
  const date = new Date(new Date().setDate(new Date().getDate() + 7))
  return res.cookie('token', data.token, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    expires: date
  }).json(data.data)
}

module.exports = tokenCookie
