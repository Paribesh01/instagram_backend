import { Body, Controller, Get, Post, Req, UsePipes } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Prisma } from "@prisma/client";
import { LoginDto, LoginSchema } from "./dto/login.dto";
import { JwtService } from "@nestjs/jwt";
import { SignupDto, SignupSchema } from "./dto/register.dto";

import { Public } from "src/common/decorator/public";
import { Request } from "express";
import { ZodValidationPipe } from "src/common/pipe/zod.pipe";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}
  @Public()
  @Post("login")
  @UsePipes(new ZodValidationPipe(LoginSchema))
  signin(@Body() signinDto: LoginDto) {
    return this.authService.signin(signinDto.username, signinDto.password);
  }
  @Public()
  @Post("register")
  @UsePipes(new ZodValidationPipe(SignupSchema))
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(
      signupDto.username,
      signupDto.email,
      signupDto.password
    );
  }
  @Get("getProfile")
  getProfile(@Req() request: Request) {
    return this.authService.getProfile(request["user"].sub);
  }
  @Get("me")
  async me() {
    return {
      valid: true,
    };
  }
}
