import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Prisma } from '@prisma/client';
import { loginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { registerDto } from './dto/register.dto';

import { Public} from 'src/common/decorator/public';
import { Request } from 'express';

@Controller('auth')
export class AuthController {


constructor(private authService:AuthService){

}
@Public()
@Post('login')
signin(@Body()signinDto:loginDto){
return this.authService.signin(signinDto.email,signinDto.password)
}
@Public()
@Post ("register")
signup(@Body()signupDto:registerDto){
    return this.authService.signup(signupDto.name,signupDto.email,signupDto.password)
}
@Get("getProfile")
getProfile(@Req()request:Request){
    return this.authService.getProfile(request["user"].sub)

}
@Get("me")
async me(){
    return {
        valid:true
    }
}
}
