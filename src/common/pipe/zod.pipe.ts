import {
    PipeTransform,
    ArgumentMetadata,
    BadRequestException,
  } from '@nestjs/common';
  import { ZodSchema, ZodError } from 'zod';
  
  export class ZodValidationPipe implements PipeTransform {
    constructor(private schema: ZodSchema) {}
  
    transform(value: unknown, metadata: ArgumentMetadata) {
      try {
        const parsedValue = this.schema.parse(value);
        return parsedValue;
      } catch (error) {
        console.log(value);
        if (error instanceof ZodError) {
          throw new BadRequestException(error.errors[0].message);
        }
        throw new BadRequestException('Validation failed');
      }
    }
  }
  