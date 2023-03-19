import fastify from 'fastify'
import { env } from './env'

const app = fastify()

const start = async () => {
  try {
    await app.listen({ port: env.PORT })
    console.log(`LISTENING ON ${env.PORT}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
