import { randomUUID } from 'crypto'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/:id', async (req, res) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })
    const { id } = paramsSchema.parse(req.params)
    const transactionById = await knex('transactions').where('id', id).first()
    return transactionById
  })

  app.post('/', async (req, res) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amount, type } = createTransactionBodySchema.parse(req.body)

    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
    })
    return res.status(201).send()
  })

  app.get('/', async (req, res) => {
    const transactionList = await knex('transactions').select('*')
    return { transactionList }
  })

  app.get('/summary', async (req, res) => {
    const summary = await knex('transactions')
      .sum('amount', { as: 'amount' })
      .first()
    return { summary }
  })
}
