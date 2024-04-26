import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Req } from '@nestjs/common';
import { PostService } from './post.service';
import { Request } from 'express';
import { CreatePostDto } from './dto/createPost.dto';
import { request } from 'http';

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

@Delete("deletePost/:id")
deletePost(@Param("id",ParseIntPipe)id:number,@Req()request:Request){
    return this.postService.deletePost(request["user"].sub,id)
}




}
