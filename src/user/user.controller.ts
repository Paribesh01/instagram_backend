import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma } from '@prisma/client';
import { Request, Response, request } from 'express';
import { PrefencesDto } from './dto/prefences.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Public } from 'src/common/decorator/public';


@Controller('user')
export class UserController {

  constructor(private readonly userService: UserService) {}
  
  @Get("me")
  async getPrefence(@Req()request:Request){
    return await this.userService.getPrefences(request["user"].sub)
  }
  @Post("prefence")
  async updatePrefence (@Req()request:Request,@Body()body:PrefencesDto){
    return await this.userService.setprefences(request["user"].sub,body,)
  } 
@Public()
@Get("img/:url")
async getImage(@Param("url")filename:string,@Res()res:Response){
res.sendFile(filename,{root:'./public/img'})
}

@Post("uploadDp")
@UseInterceptors(FileInterceptor("file",{
  storage:diskStorage({
    destination:'public/img',
    filename:(req,file,cb)=>{
      const filename = (req as Request)["user"].sub
      cb(null,filename);
    }
  })
}))
async uploadDp(@UploadedFile()file:Express.Multer.File,@Req()request:Request){
  return await this.userService.uplodeDp(request['user'].sub,file.originalname)
} 

  @Post(":email/follow")
  async follow(@Req()request:Request,@Param("email")email:string){
    return this.userService.follow(email,request["user"].sub)
  }
  @Post(":email/unfollow")
  async unFollow(@Req()request:Request,@Param("email")email:string){
    return this.userService.unFollow(email,request["user"].sub)
  }
  @Get(":email/following")
  async following(@Param("email")email:string){
    return this.following(email)
  }
}
