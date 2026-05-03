import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { configuration } from 'src/config';
import { TypeOrmConfigService } from 'src/database/typeorm/typeorm.service';
import { AuthModule } from '../../auth/auth.module';
import { UserController } from './user.controller';
import { User } from '../../../database/entities/user.entity';
import { UserService } from '../services/user.service';
import { MailService } from 'src/common/mail/mail.service';
import { MailModule } from 'src/common/mail/mail.module';

describe('UserController', () => {
  let controller: UserController;
  let fakeUserService: Partial<UserService>;
  beforeEach(async () => {
    fakeUserService = {
      createUser: () => {
        return Promise.resolve({
          id: 1,
          email: 'testuser@example.com',
          password: 'password',
        } as User);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: fakeUserService,
        },
        {
          provide: MailService,
          useValue: {
            sendWelcomeEmail: jest.fn(),
          },
        },
      ],
      imports: [
        AuthModule,
        MailModule,
        EventEmitterModule.forRoot(),
        ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
        TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
