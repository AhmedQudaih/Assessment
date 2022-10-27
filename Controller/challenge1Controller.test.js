import mongoose from 'mongoose'
import request from 'supertest'
import jwt from 'jsonwebtoken'

import createMongooseMemoryServer from 'mongoose-memory'

import createServer from '../app.js'
import Pet from '../Model/petModel.js'

const mongooseMemoryServer = createMongooseMemoryServer(mongoose)
const app = createServer()

const secrets = process.env.SECRETS.split(' ')

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

  test('success place Bid', async () => {
    const petOwner = mongoose.Types.ObjectId()

    const firstPet = new Pet({ name: 'pet1', bids: [], petOwner })
    await firstPet.save()

    const token = jwt.sign({ id: mongoose.Types.ObjectId() }, secrets[0])

    const res = await request(app).post(`/challenge1/pet/${firstPet._id}/placeBid`)
      .set('authorization', 'Bearer ' + token)
      .send({ amount: 150 })

    expect(res.body.description).toBe('Success')
    expect(res.status).toBe(200)
  })

  test('error place Bid', async () => {
    const petOwner = mongoose.Types.ObjectId()

    const firstPet = new Pet({ name: 'pet1', bids: [], petOwner })
    await firstPet.save()

    const token = jwt.sign({ id: mongoose.Types.ObjectId() }, secrets[0])

    const res = await request(app).post(`/challenge1/pet/${firstPet._id}/placeBid`)
      .set('authorization', 'Bearer ' + token)
      .send()

    expect(res.status).toBe(400)
  })

  test('success get bids', async () => {
    const petOwner = mongoose.Types.ObjectId()

    const firstPet = new Pet({
      name: 'pet1',
      bids: [{ userId: mongoose.Types.ObjectId(), amount: 50 },
        { userId: mongoose.Types.ObjectId(), amount: 800 }, { userId: mongoose.Types.ObjectId(), amount: 120 }],
      petOwner
    })
    await firstPet.save()

    const token = jwt.sign({ id: petOwner }, secrets[0])
    const res = await request(app).get(`/challenge1/pet/${firstPet._id}/getBids`)
      .set('authorization', 'Bearer ' + token)
      .send()

    expect(res.status).toBe(200)
    expect(res.body.length).toBe(3)
  })

  test('get bids not Owner', async () => {
    const petOwner = mongoose.Types.ObjectId()

    const firstPet = new Pet({
      name: 'pet1',
      bids: [{ userId: mongoose.Types.ObjectId(), amount: 50 },
        { userId: mongoose.Types.ObjectId(), amount: 800 }, { userId: mongoose.Types.ObjectId(), amount: 120 }],
      petOwner
    })
    await firstPet.save()

    const token = jwt.sign({ id: mongoose.Types.ObjectId() }, secrets[0])
    const res = await request(app).get(`/challenge1/pet/${firstPet._id}/getBids`)
      .set('authorization', 'Bearer ' + token)
      .send()

    expect(res.status).toBe(400)
  })

  test('not authorized', async () => {
    const petOwner = mongoose.Types.ObjectId()

    const firstPet = new Pet({
      name: 'pet1',
      bids: [{ userId: mongoose.Types.ObjectId(), amount: 50 },
        { userId: mongoose.Types.ObjectId(), amount: 800 }, { userId: mongoose.Types.ObjectId(), amount: 120 }],
      petOwner
    })
    await firstPet.save()

    const res = await request(app).get(`/challenge1/pet/${firstPet._id}/getBids`)
      .send()

    expect(res.body.message).toBe('Incorrect Token Given')
  })

  test('invalid token', async () => {
    const petOwner = mongoose.Types.ObjectId()

    const firstPet = new Pet({
      name: 'pet1',
      bids: [{ userId: mongoose.Types.ObjectId(), amount: 50 },
        { userId: mongoose.Types.ObjectId(), amount: 800 }, { userId: mongoose.Types.ObjectId(), amount: 120 }],
      petOwner
    })
    await firstPet.save()

    const token = jwt.sign({ id: petOwner }, '123123')
    const res = await request(app).get(`/challenge1/pet/${firstPet._id}/getBids`)
      .set('authorization', 'Bearer ' + token)
      .send()

    expect(res.body.message).toBe('Failed To Authenticate')
  })
})
