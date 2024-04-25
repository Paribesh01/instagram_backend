import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Prisma } from '@prisma/client';
import { loginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { registerDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {


constructor(private authService:AuthService){

}

@Post('login')
signin(@Body()signinDto:loginDto){
return this.authService.signin(signinDto.email,signinDto.password)
}

@Post ("register")
signup(@Body()signupDto:registerDto){
    return this.authService.signup(signupDto.name,signupDto.email,signupDto.password)
}


}
