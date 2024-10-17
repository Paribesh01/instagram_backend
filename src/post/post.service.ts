import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { Request } from "express";
import { CreatePostDto } from "./dto/createPost.dto";
import { DatabaseService } from "src/database/database.service";
import { UserService } from "src/user/user.service";
import { UpdatePostDto } from "./dto/updatePost.dto";
import { randomUUID } from "crypto";
import { S3Service } from "src/s3/s3.service";
import * as sharp from "sharp";

@Injectable()
export class PostService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly userService: UserService,
    private readonly s3Service: S3Service
  ) { }

  async createPost(
    createPostDto: CreatePostDto,
    request: Request,
    images: Express.Multer.File[]
  ) {
    try {

      const imageKeys: string[] = [];
      const imageUrls: string[] = [];
      for (const image of images) {
        const imgUUID = randomUUID();
        imageKeys.push(imgUUID);
        imageUrls.push(this.s3Service.getImageUrl(imgUUID));
        const optimizedImg = await this.transformImage(image.buffer);
        this.s3Service.uploadImage(optimizedImg, `${imgUUID}.png`);
      }

      const userId = request["user"].sub;
      const NewPost = await this.databaseService.post.create({
        data: {
          content: createPostDto.content,
          authorId: userId,
          imagesKey: imageKeys,
          imagesUrl: imageUrls,

        },
      });
      return NewPost;
    } catch (e) {
      console.log(e)
      return e.message;
    }
  }

  async isLiked(postId: string, userId: string) {
    try {
      // Fetch the likes for the post and check if the userId exists in the likes array
      const post = await this.databaseService.post.findUnique({
        where: {
          id: postId,
        },
        select: {
          likes: {
            select: {
              id: true,
            },
          },
        },
      });

      const userLiked = post?.likes.some((like) => like.id === userId);

      return userLiked || false;
    } catch (e) {
      console.log(e);
      return false;
    }
  }


  async Feed(userId: string) {
    try {
      //select feed whose authorId is not userid
      const feedData = await this.databaseService.post.findMany({
        where: {
          authorId: {
            not: userId,
          },
        },
        select: {
          id: true,
          author: {
            select: {
              username: true,
              userPreferences: {
                select: {
                  imageUrl: true,
                },
              },
            },
          },
          imagesUrl: true,
          _count: {
            select: {
              likes: true,
              Comment: true,
            },
          },
        },
      });
      return feedData;
    } catch (e) {
      console.log(e.message);
    }
  }

  async deletePost(userId: string, id: string) {
    try {
      const deletedPost = await this.databaseService.post.delete({
        where: {
          id: id,
          authorId: userId,
        },
      });

      for (const key of deletedPost.imagesKey) {
        await this.s3Service.removeImage(key);
      }

      return deletedPost;
    } catch (e) {
      return e.message;
    }
  }

  async getOnePost(id: string) {
    try {
      const foundedPost = await this.databaseService.post.findUnique({
        where: {
          id: id,
        },
        select: {
          id: true,
          imagesUrl: true,
          _count: {
            select: {
              likes: true,
              Comment: true
            }
          },
          Comment: {
            select: {
              id: true,
              content: true,
              commentedBy: {
                select: {
                  username: true,
                  userPreferences: {
                    select: {
                      imageUrl: true
                    }
                  }
                }
              }

            }

          }
        }
      });
      return foundedPost;
    } catch (e) {
      return e.message;
    }
  }

  async allPost(userId: string) {
    try {
      const allPost = await this.databaseService.post.findMany({
        where: {
          authorId: userId,
        },
        select: {
          id: true,
          content: true,
          _count: {
            select: {
              likes: true,
              Comment: true,
            },
          },
          imagesUrl: true,
        },
      });
      return allPost;
    } catch (e) {
      return e;
    }
  }

  async updatePost(id: string, userId: string, updatePostDto: UpdatePostDto) {
    try {
      const updatedPost = await this.databaseService.post.update({
        where: {
          id: id,
          authorId: userId,
        },
        data: {
          ...updatePostDto,
        },
      });
      return updatedPost;
    } catch (e) {
      return e.message;
    }
  }

  async likePost(id: string, userId: string) {
    try {
      const updatedUser = await this.databaseService.user.update({
        where: { id: userId },
        data: {
          likedPost: { connect: { id: id } },
        },
        select: {
          id: true,
          username: true,
          likedPost: true,
        },
      });
      console.log("liked the post")
      return updatedUser;
    } catch (e) {
      return e.message;
    }
  }

  async removeLike(id: string, userId: string) {
    try {
      const updatedUser = await this.databaseService.user.update({
        where: { id: userId },
        data: {
          likedPost: { disconnect: { id } },
        },
      });
      return updatedUser;
    } catch (e) {
      return e.message;
    }
  }


  private async transformImage(image: Buffer) {
    return await sharp(image).resize(320, 320).toBuffer();
  }
}
