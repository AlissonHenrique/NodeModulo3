const User = require('../models/User')

class UserController {
  async store (req, res) {
    const { email } = req.body

    /// verifica se o email existe, caso não exista retorna e cria
    if (await User.findOne({ email })) {
      return res.status(400).json({ error: 'User alteready or exist' })
    }

    const user = await User.create(req.body)

    return res.json(user)
  }

  async start (req, res) {
    const valor = await User.find()
    return res.json(valor)
  }
}
module.exports = new UserController()
