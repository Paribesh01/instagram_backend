import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { AuthGuard } from './auth/auth.gurd';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [DatabaseModule, UserModule, AuthModule, PostModule],
  controllers: [AppController],
  providers: [AppService,{
    provide:APP_GUARD,
    useClass:AuthGuard
  }],
})
export class AppModule {}
