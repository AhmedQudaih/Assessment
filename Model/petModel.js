import mongoose from 'mongoose'

const Schema = mongoose.Schema

const petSchema = new Schema({
  name: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'category' },
  petOwner: { type: Schema.Types.ObjectId, ref: 'user' },
  photoUrls: { type: Schema.Types.Mixed },
  tags: { type: Schema.Types.Mixed },
  bids: { type: Schema.Types.Mixed },
  status: { type: String }

})
export default mongoose.model('pet', petSchema)
