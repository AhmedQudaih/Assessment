import mongoose from 'mongoose'

import createServer from './app.js'

const app = createServer()
const port = process.env.PORT

main().catch(err => console.log(err))

async function main () {
  await mongoose.connect(process.env.MONGO_URL)
}

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`)
})
