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


  async Feed(userId:number){
    try{
      //select feed whose authorId is not userid
      const feedData = await this.databaseService.post.findMany({
        where: {
          authorId: {
            not: userId
          }
        },select:{
          id:true,
          author:{
            select:{
              name:true,
              userPreferences:{
                select:{
                  imageUrl:true
                }
              }
            }
          },
          title:true,
          imgUrl:true,
          _count:{
            select:{
              likes:true,
              Comment:true
            }
          }
        }
      });
      return  feedData
    }catch(e){
      console.log(e.message)
    }
  }



  async uploadImage(userId:number,postId:number,imgUrl:string){
    try{
      const updatedPost = await this.databaseService.post.update({where:{id:postId,authorId:userId},data:{
        imgUrl
      }})
      return updatedPost
    }catch(e){
      return e.message
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
        },select:{
          id:true,
          title:true,
          content:true,
          likes:true,
          imgUrl:true,
          
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

  

  async likePost(id: number, userId: number) {
    try {
        const updatedUser = await this.databaseService.user.update({
            where: { id: userId },
            data: {
              
                likedPost: { connect: { id: id } }
            }
            ,select: {
              id:true,
              name:true,
              likedPost: true
          }
        });
        return updatedUser;
    } catch (e) {
        return e.message;
    }
}


async removeLike(id: number, userId: number) {
    try {
        const updatedUser = await this.databaseService.user.update({
            where: { id: userId },
            data: {
              
                likedPost: { disconnect: { id: id } }
            }
        });
        return updatedUser;
    } catch (e) {
        return e.message;
    }
}
  

}
