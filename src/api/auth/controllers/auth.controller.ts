import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/api/user/dto/user.dto';
import { AuthService } from '../services/auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() user: CreateUserDto) {
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() user: CreateUserDto) {
    return this.authService.register(user);
  }
}

