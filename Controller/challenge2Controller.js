import bid from '../Model/bidModel.js'
export default () => {
  async function placeBid (req, res) {
    try {
      const newBid = new bid({ name: req.body.name, amount: req.body.amount })
      await newBid.save()
      res.status(200).send({ description: 'Added successfully' })
    } catch (error) {
      res.status(400).send(JSON.stringify(error))
    }
  }

  async function result (req, res) {
    try {
      const bidList = await bid.find({}).sort({ amount: -1 }).exec()
      if (bidList.length === 0) {
        return res.status(200).send({ description: 'No Winners' })
      }
      const resultList = bidList.map((ele, i) => {
        if (bidList[i + 1]) {
          ele.amount = bidList[i + 1].amount
          return ele
        }
        return { _id: ele._id, name: ele.name, amount: 'Lost' }
      })
      res.status(200).send(resultList)
    } catch (err) /* istanbul ignore next */ {
      res.status(400).send(JSON.stringify(err))
    }
  }

  return { placeBid, result }
}
