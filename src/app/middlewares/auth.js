const jwt = require('jsonwebtoken')
const authConfig = require('../../config/auth')
const { promisify } = require('util')
module.exports = async (req, res, next) => {
  // verifica se existe tokn no header
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(404).json({ error: 'Token not provided' })
  }

  const [, token] = authHeader.split(' ')
  // verifica se token é válido
  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret)
    req.userId = decoded.id
    return next()
  } catch (err) {
    return res.status(404).json({ error: 'Token invalid' })
  }
}
