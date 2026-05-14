import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { RoleAssignedEvent } from '../events/role-assigned.event';
import { Roles } from '../enum/role.enum';

@Injectable()
export class RoleListener {
  private readonly logger = new Logger(RoleListener.name);

  @OnEvent('role.assigned')
  handleRoleAssignedEvent(event: RoleAssignedEvent) {
    this.logger.log(
      `[RoleListener] Usuario ${event.userEmail} ahora tiene el rol: ${event.roleName}`,
    );

    if (event.roleName === Roles.Merchant) {
      this.logger.log(`[RoleListener] ENVIANDO EMAIL: Bienvenido al programa de
         vendedores.`);
    } else if (event.roleName === Roles.Admin) {
      this.logger
        .log(`[RoleListener] ENVIANDO EMAIL DE SEGURIDAD: Se ha designado un
         nuevo Administrador. Verificar credenciales.`);
    }
  }
}
