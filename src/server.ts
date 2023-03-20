import { app } from './app'
import { env } from './env'

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log(`${env.DATABASE_URL}`)
    console.log(`LISTENING ON ${env.PORT}`)
  })
