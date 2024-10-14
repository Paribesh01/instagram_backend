import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { DatabaseService } from "src/database/database.service";
import { PrefencesDto } from "./dto/prefences.dto";

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) { }

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
  async setprefences(userId: string, body: PrefencesDto) {
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

  async uplodeDp(userId: string, imageUrl: string) {
    try {
      const pre = await this.databaseService.userPreferences.update({
        where: { userId },
        data: {
          imageUrl: imageUrl,
        },
      });
      return pre;
    } catch (e) {
      console.log(e);
      return new ConflictException("Error while uploading Dp");
    }
  }

  async getPrefences(userId: string) {
    const result = await this.databaseService.userPreferences.findFirst({
      where: {
        userId,
      },
      select: {
        bio: true,
        website: true,
        gender: true,
        accountType: true,
      },
    });
    return result;
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
      return await this.databaseService.user.update({
        where: { id },
        data: {
          verified: true,
        }, select: {
          password: false
        }
      });
    } catch (e) {
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
