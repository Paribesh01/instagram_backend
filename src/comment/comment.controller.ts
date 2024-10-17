import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
} from "@nestjs/common";
import { CommentService } from "./comment.service";
import { Request } from "express";

@Controller("comment")
export class CommentController {
  constructor(private readonly commentService: CommentService) { }
  @Post("/:postId")
  async postComment(
    @Body() body: { comment: string },
    @Param("postId") postId: string,
    @Req() request: Request
  ) {

    console.log("in the comment");
    console.log(body.comment); // This should now log the actual comment string

    return this.commentService.postComment(
      postId,
      request["user"].sub, // Extract the user ID from the request
      body.comment
    );
  }


  @Get(":id")
  async getOneComment(@Param("id") id: string) {
    return this.commentService.findOne(id);
  }
  @Patch(":postId")
  async updateComment(
    @Body() content: string,
    @Param("postId") postId: string,
    @Req() request: Request
  ) {
    return this.commentService.updateComment(
      postId,
      request["user"].sub,
      content
    );
  }
  @Delete(":postId")
  async removeComment(
    @Param("postId") postId: string,
    @Req() request: Request
  ) {
    return this.commentService.removeComment(postId, request["user"].sub);
  }
  @Get("post/:postId")
  async commentFromPost(@Param("postId") postId: string) {
    return this.commentService.commentFromPost(postId);
  }
}
