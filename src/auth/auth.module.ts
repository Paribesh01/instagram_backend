import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserService } from "src/user/user.service";
import { UserModule } from "src/user/user.module";
import { JwtModule } from "@nestjs/jwt";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWTSEC,
      signOptions: { expiresIn: "5hr" },
    }),
  ],
  providers: [AuthService, UserService],
  controllers: [AuthController],
})
export class AuthModule {}
