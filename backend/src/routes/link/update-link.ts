import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../../lib/prisma"
import { ClientError } from "../../errors/client-error"

export async function updateLink(app: FastifyInstance){
  app.withTypeProvider<ZodTypeProvider>().put('/trips/:tripId/links/:linkId',{
    schema: {
      params: z.object({
        tripId: z.string().uuid(),
        linkId: z.string().uuid()
      }),
      body: z.object({
        title: z.string().min(4),
        url: z.string().url()
      })
    }
  }, async (request) => {
    const { tripId, linkId } = request.params
    const { title, url } = request.body

    const trip = await prisma.trip.findUnique({
      where: {
        id: tripId
      }
    })

    if (!trip) {
      throw new ClientError('Trip not found.')
    }

    const link = await prisma.link.update({
      where:{id: linkId},
      data: {
        title,
        url,
        trip_id: tripId
      }
    })

    return { LinkId: link.id}
  })
}