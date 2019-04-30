const express = require('express')
const mongoose = require('mongoose')
const validade = require('express-validate')
const databaseConfig = require('./config/database')
class App {
  constructor () {
    this.express = express()
    this.isDev = process.env.NODE_ENV !== 'production'
    this.database()
    this.middlewares()
    this.routes()
    /// manuseia conexoes eviar erros
    this.exception()
  }

  database () {
    mongoose
      .connect(databaseConfig.uri, {
        useCreateIndex: true,
        useNewUrlParser: true
      })
      .then(
        () => {
          console.log('Banco Conectado')
        },
        err => {
          console.log(err)
        }
      )
  }
  middlewares () {
    this.express.use(express.json())
  }

  routes () {
    this.express.use(require('./routes'))
  }
  exception () {
    /// formata o erro da validação
    this.express.use((err, req, res, next) => {
      if (err instanceof validade.ValidationsError) {
        return res.status(err.status).json(err)
      }
      return res
        .status(err.status || 500)
        .json({ error: 'Internal server Error' })
    })
  }
}
module.exports = new App().express
