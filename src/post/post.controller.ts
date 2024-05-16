import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { PostService } from './post.service';
import { Request,Response } from 'express';
import { CreatePostDto } from './dto/createPost.dto';
import { request } from 'http';
import { UpdatePostDto } from './dto/updatePost.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Public } from 'src/common/decorator/public';

@Controller('post')
export class PostController {

    constructor (private readonly postService:PostService){}

@Post("create")
createPost(@Body()createPostDto:CreatePostDto,@Req() request:Request){
    return this.postService.createPost(createPostDto,request)
}
@Get ("feed")
getFeed(@Req()request:Request){
    return this.postService.Feed(request["user"].sub)
}

@Get("allPost")
allPost(@Req()request:Request){
    return this.postService.allPost(request['user'].sub)
}

@Public()
@Get("img/:url")
async getImage(@Param("url")filename:string,@Res()res:Response){
res.sendFile(filename,{root:'./public/post'})
}



@Post("postImg/:postId")
@UseInterceptors(FileInterceptor("file",{
    storage:diskStorage({
        destination:'public/post',
        filename:(req,file,cb)=>{
          cb(null,`${req.params.postId}${file.originalname}`);
        }
      })
}))
uplodeImg(@UploadedFile()file:Express.Multer.File,@Req()request:Request,@Param("postId",ParseIntPipe)id:number){
return this.postService.uploadImage(request["user"].sub,id,`${id}${file.originalname}`)
}



@Get(":id")
onePost(@Req()request:Request,@Param("id",ParseIntPipe)id:number){
    return this.postService.getOnePost(request["user"].sub,id)
}

@Put('updatePost/:id')
updatePost(@Param("id",ParseIntPipe)id:number,@Body()updatePostDto:UpdatePostDto,@Req()request:Request){
    return this.postService.updatePost(id,request["user"].sub,updatePostDto)
}

@Put("likePost/:id")
likePost(@Param("id",ParseIntPipe)id:number,@Req()request:Request){
    return this.postService.likePost(id,request['user'].sub)
}
@Put("removeLike/:id")
removeLike(@Param("id",ParseIntPipe)id:number,@Req()request:Request){
    return this.postService.removeLike(id,request['user'].sub)
}


@Delete("deletePost/:id")
deletePost(@Param("id",ParseIntPipe)id:number,@Req()request:Request){
    return this.postService.deletePost(request["user"].sub,id)
}




}
