import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseInterceptors,
  UploadedFile,
  Res,
  UsePipes,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { Request, Response, request } from "express";
import { PreferencesDto, PreferencesSchema } from "./dto/prefences.dto";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { Public } from "src/common/decorator/public";
import { ZodValidationPipe } from "src/common/pipe/zod.pipe";
import { LoginSchema } from "src/auth/dto/login.dto";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get("me")
  async getPrefence(@Req() request: Request) {
    console.log("erere")
    return await this.userService.getPrefences(request["user"].sub);
  }
  @Post("prefence")
  @UsePipes(new ZodValidationPipe(PreferencesSchema))
  async updatePrefence(@Req() request: Request, @Body() body: PreferencesDto) {
    console.log("herer")
    return await this.userService.setprefences(request["user"].sub, body);
  }
  @Public()
  @Get("img/:url")
  async getImage(@Param("url") filename: string, @Res() res: Response) {
    res.sendFile(filename, { root: "./public/img" });
  }

  @UseInterceptors(FileInterceptor('image'))
  @Post('uploadDp')
  async uploadDp(
    @UploadedFile() image: Express.Multer.File,
    @Req() request: Request,
  ) {
    console.log('dp dp');
    console.log(image);

    if (!image) {
      throw new Error('No image uploaded');
    }

    return await this.userService.uploadDp(
      request['user'].sub,
      image,
    );
  }


  @Post(":username/follow")
  async follow(@Req() request: Request, @Param("username") username: string) {
    return this.userService.follow(username, request["user"].sub);
  }
  @Post(":username/unfollow")
  async unFollow(@Req() request: Request, @Param("username") username: string) {
    return this.userService.unFollow(username, request["user"].sub);
  }
  @Get(":username/following")
  async following(@Param("username") username: string) {
    return this.following(username);
  }
}
