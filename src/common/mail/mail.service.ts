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
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Error al enviar correo real a ${to}: ${message}`);
      throw error;
    }
  }

  async sendMerchantWelcomeEmail(to: string) {
    if (!this.transporter) return;

    const from =
      this.configService.get<string>('mail.from') ||
      '"NestJS Ecommerce" <no-reply@nestjs-ecommerce.com>';

    const frontendUrl = this.configService.get<string>('frontendUrl');
    const merchantPanelUrl = `${frontendUrl}/ventas`;

    try {
      await this.transporter.sendMail({
        from,
        to,
        subject: '¡Bienvenido al Programa de Vendedores! 🛍️',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #4f46e5; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">¡Felicidades!</h1>
            </div>
            <div style="padding: 30px; color: #374151; line-height: 1.6;">
              <h2 style="color: #111827;">Ya eres parte de nuestra comunidad de vendedores</h2>
              <p>Hola,</p>
              <p>Tu solicitud para unirte al <strong>Programa de Vendedores</strong> ha sido aprobada con éxito. Ahora tienes acceso a herramientas exclusivas para gestionar tus productos y ventas.</p>
              <div style="margin: 30px 0; text-align: center;">
                <a href="${merchantPanelUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Ir al Panel de Vendedor</a>
              </div>
              <p>Estamos emocionados de ver lo que traerás a nuestra tienda.</p>
              <hr style="border: 0; border-top: 1px solid #f3f4f6; margin: 20px 0;">
              <p style="font-size: 0.875rem; color: #6b7280;">Si no solicitaste este cambio, por favor contacta a nuestro equipo de soporte de inmediato.</p>
            </div>
          </div>
        `,
      });
      this.logger.log(`Correo de Vendedor enviado a ${to}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Error enviando correo de vendedor a ${to}: ${message}`,
      );
    }
  }

  async sendAdminNotificationEmail(to: string) {
    if (!this.transporter) return;

    const from =
      this.configService.get<string>('mail.from') ||
      '"NestJS Ecommerce Security" <security@nestjs-ecommerce.com>';

    try {
      await this.transporter.sendMail({
        from,
        to,
        subject: '⚠️ Alerta de Seguridad: Nuevo Rol de Administrador Asignado',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #fee2e2; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #dc2626; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Alerta de Seguridad</h1>
            </div>
            <div style="padding: 30px; color: #374151; line-height: 1.6;">
              <h2 style="color: #991b1b;">Se ha designado un nuevo Administrador</h2>
              <p>Hola,</p>
              <p>Se te ha otorgado el rol de <strong>Administrador</strong> en el sistema. Este rol tiene privilegios elevados sobre la plataforma.</p>
              <p style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 15px;">
                <strong>Importante:</strong> Asegúrate de mantener tus credenciales seguras y utilizar autenticación de dos factores si está disponible.
              </p>
              <p>Si este cambio fue realizado por un administrador autorizado, puedes ignorar este mensaje.</p>
              <hr style="border: 0; border-top: 1px solid #f3f4f6; margin: 20px 0;">
              <p style="font-size: 0.875rem; color: #6b7280;">Este es un aviso automático de seguridad. Por favor no respondas a este correo.</p>
            </div>
          </div>
        `,
      });
      this.logger.log(`Correo de alerta de Administrador enviado a ${to}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Error enviando correo de administrador a ${to}: ${message}`,
      );
    }
  }

  async sendRoleRemovedEmail(to: string, roleName: string) {
    if (!this.transporter) return;

    const from =
      this.configService.get<string>('mail.from') ||
      '"NestJS Ecommerce" <no-reply@nestjs-ecommerce.com>';

    try {
      await this.transporter.sendMail({
        from,
        to,
        subject: 'Actualización de tu cuenta: Rol Removido',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #6b7280; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Actualización de Cuenta</h1>
            </div>
            <div style="padding: 30px; color: #374151; line-height: 1.6;">
              <h2 style="color: #111827;">Se ha modificado tu acceso</h2>
              <p>Hola,</p>
              <p>Te informamos que el rol de <strong>${roleName}</strong> ha sido removido de tu cuenta.</p>
              ${
                roleName === 'Merchant'
                  ? '<p style="color: #991b1b; font-weight: bold;">Importante: Como consecuencia, todos tus productos publicados han sido eliminados de la plataforma.</p>'
                  : ''
              }
              <p>Si crees que esto es un error, por favor contacta a nuestro equipo de soporte.</p>
              <hr style="border: 0; border-top: 1px solid #f3f4f6; margin: 20px 0;">
              <p style="font-size: 0.875rem; color: #6b7280;">Gracias por usar nuestra plataforma.</p>
            </div>
          </div>
        `,
      });
      this.logger.log(`Correo de rol removido (${roleName}) enviado a ${to}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Error enviando correo de rol removido a ${to}: ${message}`,
      );
    }
  }
}
