import * as nodemailer from "nodemailer"

declare module "nodemailer"

export class EmailService {
  static transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,

    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  })

  static async sendMail(
    to: string,
    subject: string,
    html: string
  ) {
    return await this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      html,
    })
  }
}