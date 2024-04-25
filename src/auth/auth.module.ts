import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[UserModule,
    JwtModule.register({
      global: true,
      secret: "123123123",
      signOptions: { expiresIn: '60s' },
    })
  ],
  providers: [AuthService,UserService],
  controllers: [AuthController]
})
export class AuthModule {}
