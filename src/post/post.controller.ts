import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Req } from '@nestjs/common';
import { PostService } from './post.service';
import { Request } from 'express';
import { CreatePostDto } from './dto/createPost.dto';
import { request } from 'http';
import { UpdatePostDto } from './dto/updatePost.dto';

@Controller('post')
export class PostController {

    constructor (private readonly postService:PostService){}

@Post("create")
createPost(@Body()createPostDto:CreatePostDto,@Req() request:Request){
    return this.postService.createPost(createPostDto,request)
}
@Get("allPost")
allPost(@Req()request:Request){
    return this.postService.allPost(request['user'].sub)
}

@Get(":id")
onePost(@Req()request:Request,@Param("id",ParseIntPipe)id:number){
    return this.postService.getOnePost(request["user"].sub,id)
}

@Put('updatePost/:id')
updatePost(@Param("id",ParseIntPipe)id:number,@Body()updatePostDto:UpdatePostDto,@Req()request:Request){
    return this.postService.updatePost(id,request["user"].sub,updatePostDto)
}


@Delete("deletePost/:id")
deletePost(@Param("id",ParseIntPipe)id:number,@Req()request:Request){
    return this.postService.deletePost(request["user"].sub,id)
}




}
