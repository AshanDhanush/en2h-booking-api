import {
  IsString,
  IsNumber,
  IsBoolean,
  Min,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateServiceDto {
  @ApiProperty({ example: 'Service Name', description: 'Name of the service' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  title!: string;

  @ApiProperty({
    example: 'Service Description',
    description: 'Description of the service',
  })
  @IsString()
  @MinLength(5)
  @MaxLength(500)
  description!: string;

  @ApiProperty({
    example: 30,
    description: 'Duration of the service in minutes',
  })
  @IsNumber()
  @Min(1)
  duration!: number;

  @ApiProperty({ example: 99.99, description: 'Price of the service' })
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiProperty({
    example: true,
    description: 'Indicates if the service is active',
  })
  @IsBoolean()
  isActive!: boolean;
}

export class UpdateServiceDto extends PartialType(CreateServiceDto) {}
