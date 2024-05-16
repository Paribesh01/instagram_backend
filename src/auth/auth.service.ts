import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

constructor(private userService:UserService ,private jwtService:JwtService){}



async createHash(password){
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    return hash
}


async signin(email:string,pass:string){
    const user = await this.userService.userFromEmail(email)
    const isPass = await bcrypt.compare(pass,user.password)
    if(user&&isPass){
        const payload = {
            sub:user.id,
            name:user.name
           }
           return {accessToken:await this.jwtService.signAsync(payload)
    }
    throw new UnauthorizedException()
  
   }
}

async signup(name:string,email:string,pass:string){
    const user = await this.userService.userFromEmail(email)
    if(user){
        throw new ConflictException("User already exists")
    }
    const hashedPassword = await this.createHash(pass)
        const createdUser = await this.userService.create({name,email,password:hashedPassword})
        console.log(createdUser)
        const foundUser = await this.userService.userFromEmail(email);
        const payload = {sub:foundUser.id,name:foundUser.name}
        return {
            access_token: await this.jwtService.signAsync(payload),
          };
}



async getProfile(id:number){
    const profile = await this.userService.getProfile(id)
    return profile
}



}
