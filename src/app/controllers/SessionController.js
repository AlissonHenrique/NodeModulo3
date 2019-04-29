const User = require('../models/User')

class SessionControler {
  async store (req, res) {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    // verifica se usuario com esse email
    if (!user) {
      return res.status(400).json({ error: 'User not found' })
    }

    // verifica o password
    if (!(await user.compareHash(password))) {
      return res.status(400).json({ error: 'Passwor incorrect' })
    }

    return res.json({ user, token: User.generateToken(user) })
  }
}

module.exports = new SessionControler()
