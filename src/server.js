require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const validade = require('express-validation')
const Youch = require('youch')
// lida com erros sentry
const Sentry = require('@sentry/node')
const databaseConfig = require('./config/database')
const sentryConfig = require('./config/sentry')

class App {
  constructor () {
    this.express = express()
    this.isDev = process.env.NODE_ENV !== 'production'
    this.sentry()
    this.database()
    this.middlewares()
    this.routes()
    /// manuseia conexoes eviar erros
    this.exception()
  }
  sentry () {
    Sentry.init(sentryConfig)
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
    this.express.use(Sentry.Handlers.requestHandler())
  }

  routes () {
    this.express.use(require('./routes'))
  }
  exception () {
    // erro bliblioteca opcional sentry
    if (process.env.NODE_ENV !== 'production') {
      this.express.use(Sentry.Handlers.requestHandler())
    }

    /// formata o erro da validação
    this.express.use(async (err, req, res, next) => {
      if (err instanceof validade.ValidationsError) {
        return res.status(err.status).json(err)
      }

      if (process.env.NODE_ENV !== 'production') {
        const youch = new Youch(err)
        return res.json(await youch.toJSON())
      }
      return res
        .status(err.status || 500)
        .json({ error: 'Internal server Error' })
    })
  }
}
module.exports = new App().express
