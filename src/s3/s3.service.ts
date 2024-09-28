import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class S3Service {
    private client: S3Client;
    private readonly bucketName = process.env.BUCKET_NAME;
    private readonly region = process.env.BUCKET_LOCATION;
    constructor() {

        this.client = new S3Client({
            region: this.region,
            credentials: {
                accessKeyId: process.env.ACCESS_KEY,
                secretAccessKey: process.env.SECRET_ACCESS_KEY,
            },
        });
    }


    async uploadImage(file: Buffer, key: string): Promise<any> {
        try {

            const command = new PutObjectCommand({
                Bucket: this.bucketName,
                Key: key,
                Body: file,
                ContentType: "image/png",
            });
            console.log("here")
            return await this.client.send(command);
        }catch(e) {

           console.log(e)
            }

        }
        getImageUrl(key: string) {
            return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}.png`;
          }

          async removeImage(key: string) {
            try {
              const commmand = new DeleteObjectCommand({
                Bucket: this.bucketName,
                Key: `${key}.png`,
              });
              await this.client.send(commmand);
            } catch {
              throw new InternalServerErrorException();
            }
          }

}
