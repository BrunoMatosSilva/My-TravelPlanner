import type { FastifyInstance } from "fastify"
import { prisma } from "../lib/prisma"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { getMailClient } from "../lib/mail"
import nodemailer from "nodemailer"
import { dayjs } from "../lib/dayjs"
import { ClientError } from "../errors/client-error"
import { env } from "../../env"

export async function createTrip(app: FastifyInstance){
  app.withTypeProvider<ZodTypeProvider>().post('/trips',{
    schema: {
      body: z.object({
        destination: z.string().min(4),
        starts_at: z.coerce.date(),
        ends_at: z.coerce.date(),
        owner_name: z.string(),
        owner_email: z.string().email(),
        emails_to_invite: z.array(z.string().email())
      })
    }
  }, async (request) => {
    const { destination, starts_at, ends_at, owner_name, owner_email, emails_to_invite} = request.body

    if (dayjs(starts_at).isBefore(new Date())) {
      throw new ClientError('Invalid trip start date!')
    }

    if (dayjs(ends_at).isBefore(starts_at)) {
      throw new ClientError('Invalid trip end date!')
    }

    const trip = await prisma.trip.create({
      data: {
        destination,
        starts_at,
        ends_at,
        participants: {
          createMany: {
            data: [
              {
                name: owner_name,
                email: owner_email,
                is_owner: true,
                is_confirmed: true
              },
              ...emails_to_invite.map(email => {
                return { email }
              })
            ]
          }
        }
      }
    })

    const formattedStartDate = dayjs(starts_at).format('LL')
    const formattedEndDate = dayjs(ends_at).format('LL')

    const confirmationLink = `${env.API_BASE_URL}/trips/${trip.id}/confirm`

    const email = await getMailClient()

    const message = await email.sendMail({
      from: {
        name: 'Equipe planner',
        address: 'contato@planner.com.br',
      },
      to: {
        name: owner_name,
        address: owner_email
      },
      subject: `Confirme sua viagem para ${destination} em ${formattedStartDate}`,
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
                    <p>Você solicitou a criação de uma viagem para <strong>${destination}</strong> nas datas de <strong>${formattedStartDate}</strong> até <strong>${formattedEndDate}</strong>.</p>
                    <p></p>
                    <p>Para confirmar sua viagem, clique no link abaixo:</p>
                    <p></p>
                    <a href="${confirmationLink}" class="button">Confirmar viagem</a>
                    <p></p>
                    <p>Caso você não saiba do que se trata esse e-mail, apenas ignore esse e-mail.</p>
                </div>
                <div class="footer">
                    <p>&copy; 2024 Planner. Todos os direitos reservados.</p>
                </div>
            </div>
        </body>
        </html>
`
    })

    console.log(nodemailer.getTestMessageUrl(message))
  
    return {TripId: trip.id}
  })
}