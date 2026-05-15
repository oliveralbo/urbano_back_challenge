import { Body, Controller, Post } from '@nestjs/common';
import { Auth } from 'src/api/auth/guards/auth.decorator';
import { AssignRoleDto } from '../dto/role.dto';
import { RoleIds } from '../enum/role.enum';
import { RoleService } from '../services/role.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiBearerAuth()
  @Auth(RoleIds.Admin)
  @Post('assign')
  async assignRoleToUser(@Body() body: AssignRoleDto) {
    return this.roleService.assignRoleToUser(body);
  }

  @ApiBearerAuth()
  @Auth(RoleIds.Admin)
  @Post('unassign')
  async unassignRoleFromUser(@Body() body: AssignRoleDto) {
    return this.roleService.unassignRoleFromUser(body);
  }
}
