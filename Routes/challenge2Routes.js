import express from 'express'
import challenge2Controller from '../Controller/challenge2Controller.js'
const router = express.Router()

export default () => {
  const challenge2 = challenge2Controller()

  router.post('/placeBid', function (req, res) {
    challenge2.placeBid(req, res)
  })

  router.get('/result', function (req, res) {
    challenge2.result(req, res)
  })
  return router
}
