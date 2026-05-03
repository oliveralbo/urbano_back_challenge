import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserRegisteredEvent } from '../events/user-registered.event';
import { MailService } from 'src/common/mail/mail.service';

@Injectable()
export class UserRegisteredListener {
  private readonly logger = new Logger(UserRegisteredListener.name);

  constructor(private readonly mailService: MailService) {}

  @OnEvent('user.registered')
  async handleUserRegisteredEvent(event: UserRegisteredEvent) {
    this.logger.log(`Procesando registro para: ${event.email}`);

    try {
      await this.mailService.sendWelcomeEmail(event.email, event.name);
      this.logger.log(
        `Correo de bienvenida enviado exitosamente a ${event.email}`,
      );
    } catch (error) {
      this.logger.error(
        `Error enviando correo a ${event.email}: ${error.message}`,
      );
    }
  }
}
