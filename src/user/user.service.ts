import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { DatabaseService } from 'src/database/database.service';
import { PrefencesDto } from './dto/prefences.dto';

@Injectable()
export class UserService {
constructor (private readonly databaseService:DatabaseService){}

  async create(createUserDto: Prisma.UserCreateInput) {
    return this.databaseService.user.create({data:{...createUserDto,userPreferences:{
      create:{}
    }}})
  }
  async userFromEmail(email: string) {
    return this.databaseService.user.findUnique({ where: { email } });
  }
  async setprefences(userId:number,body:PrefencesDto){
    type genderEnum = "MALE"|"FEMALE"|"OTHERS"
    type accountEnum = "PRIVATE"|"PUBLIC"
    const {bio,gender,website,accountType} = body
    const pre = await this.databaseService.userPreferences.update({where:{userId},data:{
      bio,
      gender:gender as genderEnum,
      accountType:accountType as accountEnum,
      website,
    }})
    return pre
  }
  async uplodeDp(userId:number,imageUrl:string){
    try{
      
      const pre = await this.databaseService.userPreferences.update({where:{userId},data:{
        
        imageUrl:imageUrl,
      }})
      return pre
    }catch(e){
      console.log(e)
      return new ConflictException("Error while uploading Dp")
    }
}

  async getPrefences (userId:number){
    const result = await this.databaseService.userPreferences.findFirst({where:{
      userId
    },
    select:{
      bio:true,
      website:true,
      gender:true,
      accountType:true
    }
  })
  return result
  }

  async getProfile(id:number){
    return this.databaseService.user.findUnique({where:{id},select:{
      id:true,
      email:true,
      name:true,
      posts:true

    }})
  }


  async follow(email:string,userId:number){
    try{
      const userToFollow = await this.databaseService.user.findUnique({where:{id:userId}})
      if(userToFollow.email==email){
        return new BadRequestException("can't follow yourself")
      }
      const user = await this.databaseService.user.update({where:{email},data:{
        followedBy:{
          connect:{
            id:userId
          }
        }
      },select:{
        followedBy:true,
        following:true
      }})
      return user
    }catch{
      return new ConflictException("Error while following user")
    }
  }
  async unFollow(email:string,userId:number){
    try{
      const userToFollow = await this.databaseService.user.findUnique({where:{id:userId}})
      if(userToFollow.email==email){
        return new BadRequestException("can't follow yourself")
      }
      const user = await this.databaseService.user.update({where:{email},data:{
        followedBy:{
          disconnect:{
            id:userId
          }
        }
      },select:{
        followedBy:true,
        following:true
      }})
      return user
    }catch{
      return new ConflictException("Error while following user")
    }
  }
  async following(email:string){
    try{

      const following = await this.databaseService.user.findFirst({where:{email},select:{
        following:true
      }})
      return following.following
    }catch{
      return new Error("Error while finding following")
    }
  }
 
}
