import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ZodType, ZodError, z } from 'zod';

@Injectable()
export class ZodValidationPipe<T extends ZodType>
  implements PipeTransform
{
  constructor(private readonly schema: T) {}



  transform(value: unknown) {
    const result = this.schema.safeParse(value);
    console.log("INPUT!!!", value)

    if (!result.success) {
    console.log("ERRORS!!!", result.error)
      throw new BadRequestException({
        message: 'Validation failed',
        errors: z.flattenError(result.error),
      });
    }

    return result.data as ReturnType<T['parse']>;
  }
}