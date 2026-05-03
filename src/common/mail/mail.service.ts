import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.init();
  }

  private init() {
    const host = this.configService.get<string>('mail.host');
    const port = this.configService.get<number>('mail.port');
    const user = this.configService.get<string>('mail.user');
    const pass = this.configService.get<string>('mail.pass');

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port: port || 587,
        secure: this.configService.get<boolean>('mail.secure'),
        auth: {
          user,
          pass,
        },
      });
      this.logger.log(`MailService configurado con SMTP real: ${host}`);
    } else {
      this.logger.warn(
        'AVISO: Faltan credenciales SMTP en el .env. El envío de correos fallará hasta que se configuren MAIL_HOST, MAIL_USER y MAIL_PASS.',
      );
    }
  }

  async sendWelcomeEmail(to: string, name?: string) {
    if (!this.transporter) {
      const errorMsg =
        'No se puede enviar el correo: Transporter no inicializado. Verifica el .env y REINICIA el servidor.';
      this.logger.error(errorMsg);
      throw new Error(errorMsg);
    }

    const from =
      this.configService.get<string>('mail.from') ||
      '"NestJS Ecommerce" <no-reply@nestjs-ecommerce.com>';

    try {
      const info = await this.transporter.sendMail({
        from,
        to,
        subject: '¡Bienvenido a nuestra plataforma! 🚀',
        text: `Hola ${name || to}, gracias por registrarte.`,
        html: `<b>Hola ${
          name || to
        }</b>,<br>Gracias por registrarte en nuestra plataforma de E-commerce.`,
      });

      this.logger.log(
        `Correo enviado exitosamente a ${to}. ID: ${info.messageId}`,
      );
    } catch (error) {
      this.logger.error(
        `Error al enviar correo real a ${to}: ${error.message}`,
      );
      throw error;
    }
  }
}
