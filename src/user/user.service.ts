import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { DatabaseService } from "src/database/database.service";
import { PreferencesDto } from "./dto/prefences.dto";
import { randomUUID } from "crypto";
import { S3Service } from "src/s3/s3.service";
import * as sharp from "sharp";

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService, private readonly s3Service: S3Service) { }

  async create(createUserDto: Prisma.UserCreateInput) {
    return this.databaseService.user.create({
      data: {
        ...createUserDto,
        userPreferences: {
          create: {},
        },
      },
    });
  }
  async userFromUsername(username: string) {
    return this.databaseService.user.findUnique({ where: { username } });
  }
  async setprefences(userId: string, body: PreferencesDto) {
    type genderEnum = "MALE" | "FEMALE" | "OTHERS";
    type accountEnum = "PRIVATE" | "PUBLIC";
    const { bio, gender, website, accountType } = body;
    const pre = await this.databaseService.userPreferences.update({
      where: { userId },
      data: {
        bio,
        gender: gender as genderEnum,
        accountType: accountType as accountEnum,
        website,
      },
    });
    return pre;
  }

  async uploadDp(userId: string, image: Express.Multer.File) {
    try {
      console.log("image", image)
      const imgUUID = randomUUID(); // Generate a unique ID for the new profile picture
      const optimizedImg = await this.transformImage(image.buffer);
      await this.s3Service.uploadImage(optimizedImg, `${imgUUID}.png`);
      const imageUrl = this.s3Service.getImageUrl(imgUUID)
      const updatedPreferences = await this.databaseService.userPreferences.update({
        where: { userId },
        data: {
          imageUrl,
        },
      });

      return updatedPreferences;
    } catch (e) {

      console.log("Error while uploading DP:", e);
      throw new ConflictException("Error while uploading DP");
    }
  }

  private async transformImage(image: Buffer) {
    return await sharp(image).resize(320, 320).toBuffer();
  }

  async getPrefences(userId: string) {
    console.log("htee")
    const result = await this.databaseService.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        username: true,
        email: true,
        _count: {
          select: {
            posts: true,
            followedBy: true,
            following: true
          }
        },
        userPreferences: {
          select: {
            bio: true,
            website: true,
            gender: true,
            accountType: true,
            imageUrl: true
          }
        }
      },
    });
    return result;
  }


  async getUser(id: string) {
    const user = await this.databaseService.user.findUnique({
      where: { id },
      select: {
        username: true,
        id: true,
        userPreferences: {
          select: {
            imageUrl: true,
          }
        }
      }
    });
    return user;

  }

  async getProfile(id: string) {
    return this.databaseService.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        posts: {
          select: {
            id: true,

            content: true,
            imagesUrl: true,
            _count: {
              select: {
                likes: true,
                Comment: true,
              },
            },
          },
        },
        userPreferences: {
          select: {
            bio: true,
            website: true,
            gender: true,
            accountType: true,
            imageUrl: true,
          },
        },
        _count: {
          select: {
            followedBy: true,
            following: true,
            posts: true,
          },
        },
      },
    });
  }


  async verifyUser(id: string) {
    try {
      console.log("id", id)
      const user = await this.databaseService.user.update({
        where: { id },
        data: {
          verified: true,
        }
      });
      delete user.password
      return user
    } catch (e) {
      console.log("invalid tokkken")
      throw new NotFoundException('Invalid token');
    }
  }

  async follow(username: string, userId: string) {
    try {
      const userToFollow = await this.databaseService.user.findUnique({
        where: { id: userId },
      });
      if (userToFollow.username == username) {
        return new BadRequestException("can't follow yourself");
      }
      const user = await this.databaseService.user.update({
        where: { username },
        data: {
          followedBy: {
            connect: {
              id: userId,
            },
          },
        },
        select: {
          followedBy: true,
          following: true,
        },
      });
      return user;
    } catch {
      return new ConflictException("Error while following user");
    }
  }
  async unFollow(username: string, userId: string) {
    try {
      const userToFollow = await this.databaseService.user.findUnique({
        where: { id: userId },
      });
      if (userToFollow.username == username) {
        return new BadRequestException("can't follow yourself");
      }
      const user = await this.databaseService.user.update({
        where: { username },
        data: {
          followedBy: {
            disconnect: {
              id: userId,
            },
          },
        },
        select: {
          followedBy: true,
          following: true,
        },
      });
      return user;
    } catch {
      return new ConflictException("Error while following user");
    }
  }
  async following(username: string) {
    try {
      const following = await this.databaseService.user.findFirst({
        where: { username },
        select: {
          following: true,
        },
      });
      return following.following;
    } catch {
      return new Error("Error while finding following");
    }
  }
}
