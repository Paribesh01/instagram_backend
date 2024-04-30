import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma } from '@prisma/client';
import { Request } from 'express';
import { PrefencesDto } from './dto/prefences.dto';


@Controller('user')
export class UserController {

  constructor(private readonly userService: UserService) {}
  
  @Get("me")
  async getPrefence(@Req()request:Request){
    return await this.userService.getPrefences(request["user"].sub)
  }
  @Post("prefence")
  async updatePrefence (@Req()request:Request,@Body()body:PrefencesDto){
    return await this.userService.setprefences(request["user"].sub,body)
  } 
  
}
