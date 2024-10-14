import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { AuthGuard } from './auth/auth.gurd';
import { APP_GUARD } from '@nestjs/core';
import { CommentModule } from './comment/comment.module';
import { S3Service } from './s3/s3.service';
import { S3Module } from './s3/s3.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [DatabaseModule, UserModule, AuthModule, PostModule, CommentModule, S3Module, MailModule],
  controllers: [AppController],
  providers: [AppService,{
    provide:APP_GUARD,
    useClass:AuthGuard
  }, S3Service],
})
export class AppModule {}
