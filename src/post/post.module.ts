import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { UserService } from 'src/user/user.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/auth.gurd';
import { S3Service } from 'src/s3/s3.service';

@Module({
  
  controllers: [PostController],
  providers: [PostService,UserService,S3Service]
})
export class PostModule {}
