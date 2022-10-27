import express from 'express'
import challenge1Controller from '../Controller/challenge1Controller.js'
import auth from '../Controller/authController.js'
const router = express.Router()

export default () => {
  const challenge1 = challenge1Controller()

  router.post('/pet/:petId/placeBid', auth, function (req, res) {
    challenge1.placeBid(req, res)
  })

  router.get('/pet/:petId/getBids', auth, function (req, res) {
    challenge1.getBids(req, res)
  })
  return router
}
