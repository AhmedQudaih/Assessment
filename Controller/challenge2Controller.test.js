import mongoose from 'mongoose'
import request from 'supertest'
// import jwt from 'jsonwebtoken'

import createMongooseMemoryServer from 'mongoose-memory'

import createServer from '../app.js'
import Bid from '../Model/bidModel.js'

const mongooseMemoryServer = createMongooseMemoryServer(mongoose)
const app = createServer()

describe('testing Subscriber Routes', () => {
  beforeAll(async () => {
    await mongooseMemoryServer.start()
    await mongooseMemoryServer.connect('test-db')
  })

  afterEach(async () => {
    await mongooseMemoryServer.purge()
  })

  afterAll(async () => {
    await mongooseMemoryServer.disconnect()
    await mongooseMemoryServer.stop()
  })

  test('success get result', async () => {
    const firstBid = new Bid({ name: 'user1', amount: 100 })
    await firstBid.save()

    const secondBid = new Bid({ name: 'user3', amount: 300 })
    await secondBid.save()

    const thirdBid = new Bid({ name: 'user2', amount: 80 })
    await thirdBid.save()

    const res = await request(app).get('/challenge2/result')
      .send()

    expect(res.status).toBe(200)
    expect(res.body[0].amount).toBe(100)
    expect(res.body[1].amount).toBe(80)
    expect(res.body[2].amount).toBe('Lost')
  })

  test('success get result no winners', async () => {
    const res = await request(app).get('/challenge2/result')
      .send()

    expect(res.status).toBe(200)
    expect(res.body.description).toBe('No Winners')
  })

  test('success place bid', async () => {
    const res = await request(app).post('/challenge2/placeBid')
      .send({ name: 'user1', amount: 100 })
    expect(res.body.description).toBe('Added successfully')
    expect(res.status).toBe(200)
  })

  test('error place bid', async () => {
    const res = await request(app).post('/challenge2/placeBid')
      .send({ name: 'user1' })
    expect(res.status).toBe(400)
  })
})
