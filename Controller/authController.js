import jwt from 'jsonwebtoken'

const secrets = process.env.SECRETS.split(' ')

export default (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (token) {
    jwt.verify(token, secrets[0], (err, decoded) => {
      if (err) {
        return res.json({
          isLoggedIn: false,
          message: 'Failed To Authenticate'
        })
      }
      req.user = {}
      req.user.id = decoded.id
      next()
    })
  } else {
    res.json({
      isLoggedIn: false,
      message: 'Incorrect Token Given'
    })
  }
}
