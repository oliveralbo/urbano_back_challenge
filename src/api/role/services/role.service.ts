import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from 'src/database/entities/role.entity';
import { AssignRoleDto } from '../dto/role.dto';
import { UserService } from 'src/api/user/services/user.service';
import { errorMessages } from 'src/errors/custom';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RoleAssignedEvent } from '../events/role-assigned.event';
import { RoleUnassignedEvent } from '../events/role-unassigned.event';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly rolesRepository: Repository<Role>,
    private readonly userService: UserService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async assignRoleToUser(data: AssignRoleDto) {
    const role = await this.findById(data.roleId);
    const user = await this.userService.findById(data.userId, { roles: true });

    if (!user.roles.some((userRole) => userRole.id === data.roleId)) {
      user.roles.push(role);
      await this.userService.save(user);

      this.eventEmitter.emit(
        'role.assigned',
        new RoleAssignedEvent(user.id, user.email, role.id, role.name),
      );
    }
    return user;
  }

  async unassignRoleFromUser(data: AssignRoleDto) {
    const role = await this.findById(data.roleId);
    const user = await this.userService.findById(data.userId, { roles: true });

    const roleIndex = user.roles.findIndex(
      (userRole) => userRole.id === data.roleId,
    );

    if (roleIndex !== -1) {
      user.roles.splice(roleIndex, 1);
      await this.userService.save(user);

      this.eventEmitter.emit(
        'role.unassigned',
        new RoleUnassignedEvent(user.id, user.email, role.id, role.name),
      );
    }
    return user;
  }

  async findById(roleId: number) {
    const role = await this.rolesRepository.findOne({
      where: {
        id: roleId,
      },
    });
    if (!role) {
      throw new NotFoundException(errorMessages.role.notFound);
    }
    return role;
  }
}
