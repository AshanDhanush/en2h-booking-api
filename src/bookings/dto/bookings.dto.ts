import {
  IsString,
  IsEmail,
  IsUUID,
  IsEnum,
  Matches,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BookingStatus } from '../../database/entities/bookings.entity';

export class CreateBookingDto {
  @ApiProperty({ example: 'Kasun Amal', description: 'Name of the customer' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  customerName!: string;

  @ApiProperty({
    example: 'kasun.amal@example.com',
    description: 'Email of the customer',
  })
  @IsEmail()
  customerEmail!: string;

  @ApiProperty({
    example: '1234567890',
    description: 'Phone number of the customer',
  })
  @IsString()
  @MinLength(10)
  @MaxLength(15)
  customerPhone!: string;

  @ApiProperty({
    example: 'service-uuid',
    description: 'UUID of the service being booked',
  })
  @IsUUID()
  serviceId!: string;

  @ApiProperty({
    example: 'Additional notes for the booking',
    description: 'Optional notes for the booking',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;

  @ApiProperty({ example: '2026-07-20', description: 'YYYY-MM-DD' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'bookingDate must be YYYY-MM-DD' })
  bookingDate!: string;

  @ApiProperty({ example: '14:30', description: 'HH:mm' })
  @Matches(/^\d{2}:\d{2}$/, { message: 'bookingTime must be HH:mm' })
  bookingTime!: string;
}
export class UpdateBookingStatusDto {
  @ApiProperty({ enum: BookingStatus, example: BookingStatus.CONFIRMED })
  @IsEnum(BookingStatus)
  status!: BookingStatus;
}
