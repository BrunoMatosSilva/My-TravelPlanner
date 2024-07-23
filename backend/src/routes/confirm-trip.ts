import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import "dayjs/locale/pt-br"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { dayjs } from "../lib/dayjs"
import { getMailClient } from "../lib/mail"
import nodemailer from "nodemailer"
import { ClientError } from "../errors/client-error"
import { env } from "../../env"

export async function confirmTrip(app: FastifyInstance){
  app.withTypeProvider<ZodTypeProvider>().get('/trips/:tripId/confirm',{
    schema: {
      params: z.object({
        tripId: z.string().uuid()
      })
    }
  }, async (request, reply) => {
    const { tripId } = request.params

    const trip = await prisma.trip.findUnique({
      where: {
        id: tripId
      },
      include: {
        participants: {
          where: {
            is_owner: false
          }
        }
      }
    })

    if (!trip) {
      throw new ClientError('Trip not found.')
    }

    if (trip.is_confirmed) {
      return reply.redirect(`http://localhost:3000/trips/${tripId}`)
    }

    await prisma.trip.update({
      where: { id: tripId },
      data: { is_confirmed: true }
    })

    const formattedStartDate = dayjs(trip.starts_at).format('LL')
    const formattedEndDate = dayjs(trip.ends_at).format('LL')

    const email = await getMailClient()

    await Promise.all(
      trip.participants.map(async (participant) => {
        const confirmationLink = `${env.API_BASE_URL}/participants/${participant.id}/confirm`

        const message = await email.sendMail({
          to: participant.email,
          from:"brunomatossilvait@gmail.com",
          subject: `Confirme sua presença na viagem para ${trip.destination} em ${formattedStartDate}`,
          html: `
          <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Email Test</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                        background-color: #f4f4f4;
                    }
                    .container {
                        width: 100%;
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        padding: 20px;
                        border-radius: 10px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        background-color: #4CAF50;
                        padding: 20px;
                        text-align: center;
                        color: white;
                        border-top-left-radius: 10px;
                        border-top-right-radius: 10px;
                    }
                    .content {
                        padding: 20px;
                        text-align: left;
                    }
                    .footer {
                        background-color: #f4f4f4;
                        padding: 10px;
                        text-align: center;
                        color: #777;
                        border-bottom-left-radius: 10px;
                        border-bottom-right-radius: 10px;
                    }
                    .button {
                        display: inline-block;
                        padding: 10px 20px;
                        font-size: 16px;
                        color: white;
                        background-color: #4CAF50;
                        text-decoration: none;
                        border-radius: 5px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Bem-vindo ao nosso plano de Viagem</h1>
                    </div>
                    <div class="content">
                        <p>Você foi convidado(a) para participar de uma viagem para <strong>${trip.destination}</strong> nas datas de <strong>${formattedStartDate}</strong> até <strong>${formattedEndDate}</strong>.</p>
                        <p></p>
                        <p>Para confirmar sua presença na viagem, clique no link abaixo:</p>
                        <p></p>
                        <a href="${confirmationLink}" class="button">Confirmar viagem</a>
                        <p></p>
                        <p>Caso você não saiba do que se trata esse e-mail, apenas ignore esse e-mail.</p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2024 My TravelPlanner. Todos os direitos reservados.</p>
                    </div>
                </div>
            </body>
            </html>
    `
        })
    
        console.log(nodemailer.getTestMessageUrl(message))
      })
    )

    return reply.redirect(`${env.WEB_BASE_URL}/trips/${tripId}`)
  })
}