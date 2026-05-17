import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Brevo from '@getbrevo/brevo';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private apiInstance?: Brevo.TransactionalEmailsApi;

  constructor(private readonly configService: ConfigService) {
    this.init();
  }

  // -------------------------
  // INIT BREVO CLIENT
  // -------------------------
  private init() {
    const apiKey = this.configService.get<string>('BREVO_API_KEY');

    if (!apiKey) {
      this.logger.warn('BREVO_API_KEY no configurada.');
      return;
    }

    this.apiInstance = new Brevo.TransactionalEmailsApi();

    this.apiInstance.setApiKey(
      Brevo.TransactionalEmailsApiApiKeys.apiKey,
      apiKey,
    );

    this.logger.log('MailService configurado con Brevo API');
  }

  private getClient(): Brevo.TransactionalEmailsApi {
    if (!this.apiInstance) {
      throw new Error('Brevo no inicializado (apiInstance undefined)');
    }
    return this.apiInstance;
  }

  private getFrom(): Brevo.SendSmtpEmailSender {
    const email = this.configService.get<string>('mail.from');

    if (!email) {
      throw new Error('mail.from no configurado en .env');
    }

    return {
      email,
      name: 'NestJS Ecommerce',
    };
  }

  private getFrontendUrl(): string {
    const url = this.configService.get<string>('frontendUrl');

    if (!url) {
      throw new Error('frontendUrl no configurado en .env');
    }

    return url;
  }

  // -------------------------
  // ERROR LOGGER CENTRAL
  // -------------------------
  private logBrevoError(context: string, error: any) {
    const debug =
      error?.response?.data ||
      error?.response?.body ||
      error?.body ||
      error?.error ||
      error;

    this.logger.error(
      `[BREVO ERROR - ${context}] ${JSON.stringify(debug, null, 2)}`,
    );
  }

  // -------------------------
  // LAYOUT HTML BASE
  // -------------------------
  private getHtmlLayout(content: string, title: string): string {
    const primaryColor = '#4f46e5'; // Indigo 600
    const secondaryColor = '#f9fafb';
    const textColor = '#374151';

    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: ${secondaryColor}; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
          .wrapper { width: 100%; table-layout: fixed; background-color: ${secondaryColor}; padding-bottom: 40px; }
          .main { background-color: #ffffff; margin: 40px auto; width: 100%; max-width: 600px; border-spacing: 0; color: ${textColor}; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden; }
          .header { background-color: ${primaryColor}; padding: 40px 20px; text-align: center; }
          .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px; }
          .content { padding: 40px 30px; line-height: 1.6; font-size: 16px; }
          .footer { text-align: center; padding: 20px; font-size: 13px; color: #9ca3af; }
          .button { display: inline-block; padding: 14px 28px; background-color: ${primaryColor}; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 25px; text-align: center; }
          .highlight { color: ${primaryColor}; font-weight: 600; }
          hr { border: none; border-top: 1px solid #e5e7eb; margin: 30px 0; }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <table class="main" align="center">
            <tr>
              <td class="header">
                <h1>${title}</h1>
              </td>
            </tr>
            <tr>
              <td class="content">
                ${content}
              </td>
            </tr>
            <tr>
              <td class="footer">
                &copy; ${new Date().getFullYear()} NestJS Ecommerce. <br>
                Este es un correo automático, por favor no lo respondas.
              </td>
            </tr>
          </table>
        </div>
      </body>
      </html>
    `;
  }

  // -------------------------
  // WELCOME EMAIL
  // -------------------------
  async sendWelcomeEmail(to: string, name?: string) {
    const client = this.getClient();
    const userName = name || to.split('@')[0];

    const html = this.getHtmlLayout(
      `
      <h2 style="margin-top: 0;">¡Hola, ${userName}! 👋</h2>
      <p>Estamos muy emocionados de tenerte con nosotros. Gracias por unirte a nuestra comunidad de compras.</p>
      <p>En nuestra plataforma podrás encontrar los mejores productos a precios increíbles.</p>
      <a href="${this.getFrontendUrl()}" class="button">Empezar a comprar</a>
      <hr>
      <p style="font-size: 14px; color: #6b7280;">Si tienes alguna duda, simplemente responde a este correo. Estamos aquí para ayudarte.</p>
      `,
      '¡Bienvenido a NestJS Ecommerce!',
    );

    const email: Brevo.SendSmtpEmail = {
      to: [{ email: to.trim() }],
      sender: this.getFrom(),
      subject: '¡Bienvenido a nuestra plataforma! 🚀',
      textContent: `Hola ${userName}, gracias por registrarte en nuestra plataforma de E-commerce.`,
      htmlContent: html,
    };

    try {
      await client.sendTransacEmail(email);
      this.logger.log(`Correo welcome enviado a ${to}`);
    } catch (error) {
      this.logBrevoError('sendWelcomeEmail', error);
      throw error;
    }
  }

  // -------------------------
  // MERCHANT WELCOME
  // -------------------------
  async sendMerchantWelcomeEmail(to: string) {
    const client = this.getClient();
    const frontendUrl = this.getFrontendUrl();
    const merchantPanelUrl = `${frontendUrl}/ventas`;

    const html = this.getHtmlLayout(
      `
      <h2 style="margin-top: 0;">¡Felicidades por tu nuevo rol! 🛍️</h2>
      <p>Tu cuenta ha sido actualizada exitosamente al perfil de <span class="highlight">Vendedor</span>.</p>
      <p>A partir de ahora, puedes empezar a publicar tus productos y gestionar tus ventas desde tu panel exclusivo.</p>
      <div style="text-align: center;">
        <a href="${merchantPanelUrl}" class="button">Ir al Panel de Vendedor</a>
      </div>
      <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">Si no solicitaste este cambio, por favor contacta con soporte de inmediato.</p>
      `,
      '¡Ya eres Vendedor!',
    );

    const email: Brevo.SendSmtpEmail = {
      to: [{ email: to.trim() }],
      sender: this.getFrom(),
      subject: '¡Bienvenido al Programa de Vendedores! 🛍️',
      htmlContent: html,
    };

    try {
      await client.sendTransacEmail(email);
      this.logger.log(`Correo merchant enviado a ${to}`);
    } catch (error) {
      this.logBrevoError('sendMerchantWelcomeEmail', error);
    }
  }

  // -------------------------
  // ADMIN NOTIFICATION
  // -------------------------
  async sendAdminNotificationEmail(to: string) {
    const client = this.getClient();

    const html = this.getHtmlLayout(
      `
      <h2 style="margin-top: 0; color: #dc2626;">⚠️ Aviso de Seguridad</h2>
      <p>Se ha asignado el rol de <span class="highlight" style="color: #dc2626;">Administrador</span> a tu cuenta.</p>
      <p>Este rol otorga privilegios elevados sobre la plataforma. Si no fuiste tú o no esperabas esta acción, asegúrate de revisar tu configuración de seguridad.</p>
      <hr>
      <p style="font-size: 14px; color: #6b7280;">Si este cambio fue correcto, puedes ignorar este mensaje.</p>
      `,
      'Cambio de Rol: Administrador',
    );

    const email: Brevo.SendSmtpEmail = {
      to: [{ email: to }],
      sender: {
        email: this.getFrom().email,
        name: 'Security System',
      },
      subject: '⚠️ Nuevo rol de Administrador asignado',
      htmlContent: html,
    };

    try {
      await client.sendTransacEmail(email);
      this.logger.log(`Correo admin enviado a ${to}`);
    } catch (error) {
      this.logBrevoError('sendAdminNotificationEmail', error);
    }
  }

  // -------------------------
  // ROLE REMOVED
  // -------------------------
  async sendRoleRemovedEmail(to: string, roleName: string) {
    const client = this.getClient();

    const html = this.getHtmlLayout(
      `
      <h2 style="margin-top: 0;">Actualización de Cuenta</h2>
      <p>Te informamos que se ha removido el rol: <span class="highlight">${roleName}</span> de tu perfil.</p>
      ${
        roleName === 'Merchant'
          ? '<p style="background-color: #fff7ed; padding: 15px; border-left: 4px solid #f97316; color: #9a3412;"><b>Aviso:</b> Como tu rol de Vendedor ha sido removido, tus productos asociados ya no estarán disponibles en la tienda.</p>'
          : ''
      }
      <p>Si crees que esto es un error, por favor ponte en contacto con nosotros.</p>
      `,
      'Tu cuenta ha sido actualizada',
    );

    const email: Brevo.SendSmtpEmail = {
      to: [{ email: to }],
      sender: this.getFrom(),
      subject: 'Actualización de tu cuenta',
      htmlContent: html,
    };

    try {
      await client.sendTransacEmail(email);
      this.logger.log(`Correo role removed enviado a ${to}`);
    } catch (error) {
      this.logBrevoError('sendRoleRemovedEmail', error);
    }
  }
}
