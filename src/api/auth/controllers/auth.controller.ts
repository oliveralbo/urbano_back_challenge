import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/api/user/dto/user.dto';
import { AuthService } from '../services/auth.service';
import { Serialize } from 'src/common/helper/serialize.interceptor';
import { LoginResponseDto } from '../dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse({ type: LoginResponseDto })
  @Serialize(LoginResponseDto)
  @Post('login')
  async login(@Body() user: CreateUserDto) {
    return this.authService.login(user);
  }

  @ApiCreatedResponse({ description: 'User registered successfully' })
  @Post('register')
  async register(@Body() user: CreateUserDto) {
    return this.authService.register(user);
  }
}

