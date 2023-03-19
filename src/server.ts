import fastify from 'fastify'
import { env } from './env'
import { transactionsRoutes } from './routes/transactions'
const app = fastify()

app.register(transactionsRoutes, {
  prefix: 'transactions',
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log(`${env.DATABASE_URL}`)
    console.log(`LISTENING ON ${env.PORT}`)
  })
