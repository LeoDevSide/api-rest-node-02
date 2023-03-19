import fastify from 'fastify'

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

start()
