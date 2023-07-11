import fastify, {
  FastifyListenOptions,
  FastifyReply,
  FastifyRequest,
} from 'fastify'
import { scrapUrl } from './scrap'
import dotenv from 'dotenv'

dotenv.config()

const PORT = Number(process.env.PORT || 3000)
const HOST = process.env.HOST || '0.0.0.0'

const server = async () => {
  try {
    const app = fastify({ logger: true })

    app.get(
      '/',
      async (
        req: FastifyRequest<{ Querystring: { url: string } }>,
        res: FastifyReply
      ) => {
        const { url } = req.query

        if (!url) {
          return { message: 'ไม่มี URL ให้ส่อง' }
        }

        const image = await scrapUrl(url)

        res.type('image/png').send(image)
      }
    )

    app.setNotFoundHandler((request, reply) => {
      reply.status(404).send({ error: 'Not found' })
    })

    const appConfig: FastifyListenOptions = { port: PORT, host: HOST }
    await app.listen(appConfig, (err, address) => {
      if (err) {
        console.error(err)
        process.exit(1)
      }
      console.log(`Server listening : ${address}`)
    })
  } catch (error) {
    console.log(error)
  }
}

server()
