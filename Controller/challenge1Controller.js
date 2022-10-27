import pet from '../Model/petModel.js'

export default () => {
  async function placeBid (req, res) {
    try {
      if (!req.body.amount) {
        throw { description: 'Amount is required' }
      }
      const petData = await pet.findById({ _id: req.params.petId })
      petData.bids.push({ userId: req.user.id, amount: req.body.amount })
      await pet.updateOne({ _id: req.params.petId }, petData)
      res.status(200).send({ description: 'Success' })
    } catch (err) {
      res.status(400).send(err)
    }
  }

  async function getBids (req, res) {
    try {
      const petData = await pet.findOne({ _id: req.params.petId, petOwner: req.user.id }).exec()
      if (!petData) {
        throw { message: 'Pet Not Found' }
      } else {
        res.status(200).send(petData.bids)
      }
    } catch (err) {
      res.status(400).send(err)
    }
  }

  return { placeBid, getBids }
}
