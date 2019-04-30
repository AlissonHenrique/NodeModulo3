const Mail = require('../services/Mail')

class PurchaseMail {
  get Key () {
    return 'PurchaseMail'
  }
  async handle (job, done) {
    const { ad, user, content } = job.data
    await Mail.sendMail({
      from: '"Alisson Henrique" <alisson@fce.edu.br>',
      to: ad.author.email,
      subject: `Solicitação de Compra:${ad.title}`,
      template: 'purchase',
      context: { user, content, ad }
    })
    return done()
  }
}
module.exports = new PurchaseMail()
