import nodemailer from 'nodemailer';
import logger from './logger';


const transporter = nodemailer.createTransport({
    host: "smtp.gmass.co",
    port: 2525,
    auth: {
        user: "gmass",
        pass: "f6d471c1-df34-4202-b1cc-d9af68ff17d5",
    },
});

const mailOptions = {
    from: '"Prueba Mailjet" <jorge0481rd@gmail.com>',
    to: "jorge0481rd@gmail.com",
    subject: "smtp.gmass.co gym-backend",
    text: "Este es un correo de prueba",
};

export const enviarEmail = async (
  destinatario: string,
  asunto: string,
  html: string
) => {
  try {
    await transporter.sendMail({
      from: '"Leury Gym" <leury.gym@gmail.com>',
      to: 'jorge0481rd@gmail.com',
      subject: asunto,
      html
    });

    logger.info(`Email enviado a: ${destinatario}`);
  } catch (error) {
    logger.error(`Error al enviar email a ${destinatario}:`, error);
  }
};