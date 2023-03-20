import { it, expect, beforeAll, afterAll, describe, beforeEach } from 'vitest'
import { execSync } from 'node:child_process'
import req from 'supertest'
import { app } from '../src/app'

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to list one transactions from user', async () => {
    const createTransactionResponse = await req(app.server)
      .post('/transactions')
      .send({
        title: 'New Transaction',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    const getTransactionsList = await req(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    const transactionId = getTransactionsList.body.transactionList[0].id
    // console.log(getTransactionsList.body)
    // console.log(transactionId)

    const getTransactionResponse = await req(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(getTransactionResponse.body.transactionById).toEqual(
      expect.objectContaining({
        title: 'New Transaction',
        amount: 5000,
      }),
    )
  })

  it('should be able to get all transactions from user', async () => {
    const createTransactionResponse = await req(app.server)
      .post('/transactions')
      .send({
        title: 'New Transaction',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    const listTransactionResponse = await req(app.server)
      .get(`/transactions`)
      .set('Cookie', cookies)
      .expect(200)

    expect(listTransactionResponse.body.transactionList).toEqual([
      expect.objectContaining({
        title: 'New Transaction',
        amount: 5000,
      }),
    ])
  })

  it('should be able to get the summary from transactions', async () => {
    const createTransactionResponse = await req(app.server)
      .post('/transactions')
      .send({
        title: 'New Transaction',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    await req(app.server).post('/transactions').set('Cookie', cookies).send({
      title: 'Debit Transaction',
      amount: 2000,
      type: 'debit',
    })

    const summaryResponse = await req(app.server)
      .get(`/transactions/summary`)
      .set('Cookie', cookies)
      .expect(200)

    expect(summaryResponse.body.summary).toEqual({
      amount: 3000,
    })
  })

  it('should be able to create a new transaction', async () => {
    await req(app.server).post('/transactions').send({
      title: 'New Transaction',
      amount: 5000,
      type: 'credit',
    })
    expect(201)
  })
})
