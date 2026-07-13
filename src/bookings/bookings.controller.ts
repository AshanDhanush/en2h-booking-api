import { BookingStatus } from './../database/entities/bookings.entity';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto, UpdateBookingStatusDto } from './dto/bookings.dto';
import { Booking } from '../database/entities/bookings.entity';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  createBooking(@Body() dto: CreateBookingDto): Promise<Booking> {
    return this.bookingsService.createBooking(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all bookings' })
  getAllBookings(): Promise<Booking[]> {
    return this.bookingsService.getAllBookings();
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'Booking ID', type: 'string' })
  getBookingById(@Param('id') id: string): Promise<Booking> {
    return this.bookingsService.getBookingById(id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', description: 'Booking ID', type: 'string' })
  @ApiOperation({ summary: 'Update booking status' })
  updateBookingStatus(
    @Param('id') id: string,
    @Body() dto: UpdateBookingStatusDto,
  ): Promise<Booking> {
    return this.bookingsService.updateBookingStatus(id, dto);
  }

  @Delete(':id/cancel')
  @ApiParam({ name: 'id', description: 'Booking ID', type: 'string' })
  @ApiOperation({ summary: 'Cancel a booking' })
  cancelBooking(@Param('id') id: string): Promise<{ message: string }> {
    return this.bookingsService.cancelBooking(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all bookings' })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: BookingStatus,
    description: 'Filter bookings by status',
  })
  findAll(@Query('status') status?: BookingStatus) {
    return status
      ? this.bookingsService.getBookingsByStatus(status)
      : this.bookingsService.getAllBookings();
  }
}
