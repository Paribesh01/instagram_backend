import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Req,
  Res,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { PostService } from "./post.service";
import { Request, Response } from "express";
import { CreatePostDto } from "./dto/createPost.dto";
import { request } from "http";
import { UpdatePostDto } from "./dto/updatePost.dto";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
// import { diskStorage } from "multer";
import { Public } from "src/common/decorator/public";
import { randomUUID } from "crypto";

@Controller("post")
export class PostController {
  constructor(private readonly postService: PostService) { }

  @Post()
  // @UseInterceptors(
  //   FileInterceptor("file", {
  //     storage: diskStorage({
  //       destination: "public/post",
  //       filename: (req, file, cb) => {
  //         cb(null, `${req.params.postId}${file.originalname}`);
  //       },
  //     }),
  //   })
  // )

  @UseInterceptors(FilesInterceptor('images', 10))
  createPost(
    @Body() createPostDto: CreatePostDto,
    @Req() request: Request,
    @UploadedFiles() images: Express.Multer.File[],
  ) {

    return this.postService.createPost(
      createPostDto,
      request,
      images
    );
  }
  @Get("feed")
  getFeed(@Req() request: Request) {
    return this.postService.Feed(request["user"].sub);
  }

  @Get("allPost")
  allPost(@Req() request: Request) {
    return this.postService.allPost(request["user"].sub);
  }

  @Public()
  @Get("img/:url")
  async getImage(@Param("url") filename: string, @Res() res: Response) {
    res.sendFile(filename, { root: "./public/post" });
  }


  @Get(":id")
  onePost(@Param("id") id: string) {
    console.log("in post")
    return this.postService.getOnePost(id);
  }

  @Put("/:id")
  updatePost(
    @Param("id", ParseIntPipe) id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() request: Request
  ) {
    return this.postService.updatePost(id, request["user"].sub, updatePostDto);
  }

  @Get("/isLiked/:id")
  getLikes(@Param("id") id: string, @Req() request: Request) {
    return this.postService.isLiked(id, request["user"].sub);
  }

  @Post("like/:id")
  likePost(@Param("id") id: string, @Req() request: Request) {
    return this.postService.likePost(id, request["user"].sub);
  }
  @Post("unLike/:id")
  removeLike(@Param("id") id: string, @Req() request: Request) {
    return this.postService.removeLike(id, request["user"].sub);
  }

  @Delete("delete/:id")
  deletePost(@Param("id", ParseIntPipe) id: string, @Req() request: Request) {
    return this.postService.deletePost(request["user"].sub, id);
  }
}
