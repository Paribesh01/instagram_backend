import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async createHash(password) {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    return hash;
  }

  async signin(username: string, pass: string) {
    const user = await this.userService.userFromUsername(username);
    const isPass = await bcrypt.compare(pass, user.password);
    if (user && isPass) {
      const payload = {
        sub: user.id,
        name: user.username,
      };
      return { accessToken: await this.jwtService.signAsync(payload) };
    }
    throw new UnauthorizedException();
  }

  async signup(username: string, email: string, pass: string) {
    const user = await this.userService.userFromUsername(username);
    if (user) {
      throw new ConflictException("User already exists");
    }
    const hashedPassword = await this.createHash(pass);
    const createdUser = await this.userService.create({
      username,
      email,
      password: hashedPassword,
    });
    console.log(createdUser);
    const foundUser = await this.userService.userFromUsername(username);
    const payload = { sub: foundUser.id, name: foundUser.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async getProfile(id: string) {
    const profile = await this.userService.getProfile(id);
    return profile;
  }
}
