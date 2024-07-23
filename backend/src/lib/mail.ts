import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config()

export async function getMailClient() {

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.USER_GMAIL,
      pass: process.env.PASSWORD_GMAIL
    }
  })

  return transporter
}