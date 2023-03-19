import fastify from 'fastify'
import { knex } from './database'

const app = fastify()

const start = async () => {
  try {
    await app.listen({ port: 3032 })
    console.log('listening on port 3032')
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

app.get('/', async (req, res) => {
  const tables = await knex('sqlite_schema').select('*')
  return tables
})

start()
