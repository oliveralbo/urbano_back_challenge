import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { RoleAssignedEvent } from '../events/role-assigned.event';
import { RoleUnassignedEvent } from '../events/role-unassigned.event';
import { Roles } from '../enum/role.enum';
import { MailService } from 'src/common/mail/mail.service';

@Injectable()
export class RoleListener {
  private readonly logger = new Logger(RoleListener.name);

  constructor(private readonly mailService: MailService) {}

  @OnEvent('role.assigned')
  async handleRoleAssignedEvent(event: RoleAssignedEvent) {
    this.logger.log(
      `[RoleListener] Usuario ${event.userEmail} ahora tiene el rol: ${event.roleName}`,
    );

    if (event.roleName === Roles.Merchant) {
      await this.mailService.sendMerchantWelcomeEmail(event.userEmail);
    } else if (event.roleName === Roles.Admin) {
      await this.mailService.sendAdminNotificationEmail(event.userEmail);
    }
  }

  @OnEvent('role.unassigned')
  async handleRoleUnassignedEvent(event: RoleUnassignedEvent) {
    this.logger.log(
      `[RoleListener] Se le ha quitado el rol ${event.roleName} al usuario ${event.userEmail}`,
    );

    await this.mailService.sendRoleRemovedEmail(
      event.userEmail,
      event.roleName,
    );
  }
}
