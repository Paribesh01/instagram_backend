import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req } from '@nestjs/common';
import { CommentService } from './comment.service';
import { Request } from 'express';

@Controller('comment')
export class CommentController {

constructor(private readonly commentService:CommentService){}

@Post("/posComment/:postId")
async postComment(@Body()content:string,@Param("postId",ParseIntPipe)postId:number,@Req()request:Request){
return this.commentService.postComment(postId,request["user"].sub,content)
}

@Get(":id")
async getOneComment(@Param("id",ParseIntPipe)id:number){
    return this.commentService.findOne(id)
}
@Patch(":postId")
async updateComment(@Body()content:string,@Param("postId",ParseIntPipe)postId:number,@Req()request:Request){
    return this.commentService.updateComment(postId,request["user"].sub,content)
}
@Delete(":postId")
async removeComment(@Param("postId",ParseIntPipe)postId:number,@Req()request:Request){
    return this.commentService.removeComment(postId,request["user"].sub)
}   
@Get("post/:postId")
async commentFromPost (@Param("postId",ParseIntPipe)postId:number){
return this.commentService.commentFromPost(postId)
}



}
