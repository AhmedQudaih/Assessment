import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import challenge1Routes from './Routes/challenge1Routes.js'
import challenge2Routes from './Routes/challenge2Routes.js'

export default () => {
  const app = express()
  app.use(cors())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())
  app.use('/challenge1', challenge1Routes())
  app.use('/challenge2', challenge2Routes())

  return app
}
