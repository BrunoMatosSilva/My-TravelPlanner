import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../../lib/prisma"
import { ClientError } from "../../errors/client-error"

export async function deleteLink(app: FastifyInstance){
  app.withTypeProvider<ZodTypeProvider>().delete('/trips/:tripId/links/:linkId',{
    schema: {
      params: z.object({
        tripId: z.string().uuid(),
        linkId: z.string().uuid()
      })
    }
  }, async (request) => {
    const { tripId, linkId } = request.params

    const trip = await prisma.trip.findUnique({
      where: {
        id: tripId
      }
    })

    if (!trip) {
      throw new ClientError('Trip not found.')
    }

    await prisma.link.delete({
      where: {id: linkId}
    })

    return 
  })
}