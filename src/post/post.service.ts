import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request } from 'express';
import { CreatePostDto } from './dto/createPost.dto';
import { DatabaseService } from 'src/database/database.service';
import { UserService } from 'src/user/user.service';
import { UpdatePostDto } from './dto/updatePost.dto';

@Injectable()
export class PostService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly userService: UserService,
  ) {}

  async createPost(createPostDto: CreatePostDto, request: Request) {
    try {
      const userId = request['user'].sub;
      const NewPost = await this.databaseService.post.create({
        data: {
          title: createPostDto.title,
          content: createPostDto.content,
          authorId: userId,
        },
      });
      return NewPost;
    } catch (e) {
      return e.message;
    }
  }
  async deletePost(userId:number,id:number){
    try{
        const deletedPost = await this.databaseService.post.delete({where:{
            id:id,
            authorId:userId
        }})
        return deletedPost
    }catch(e){
        return e.message
    }
  }

async getOnePost(userId:number,id:number){
  try{
    const foundedPost = await this.databaseService.post.findUnique({where:{
      id:id,
      authorId:userId
    }})
    return foundedPost
  }catch(e){
    return e.message
  }
}

  async allPost(userId:number){
    try{
        const allPost = await this.databaseService.post.findMany({where:{
            authorId:userId
        }})
        return allPost
    }catch(e){
        return e
    }
  }

  async updatePost(id:number,userId:number,updatePostDto:UpdatePostDto){
    try{
      const updatedPost = await this.databaseService.post.update({where:{
        id:id,
        authorId:userId
      },
      data:{
        ...updatePostDto
      }
    })
    return updatedPost
    }catch(e){
      return e.message
    }
  }

  

}
