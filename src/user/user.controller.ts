import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma } from '@prisma/client';


@Controller('user')
export class UserController {

  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto:Prisma.UserCreateInput) {
    return this.userService.create(createUserDto);
  }

  
}
