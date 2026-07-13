import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Booking, BookingStatus } from '../database/entities/bookings.entity';
import { CreateBookingDto, UpdateBookingStatusDto } from './dto/bookings.dto';
import { Service } from '../database/entities/service.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
  ) {}

  async createBooking(dto: CreateBookingDto): Promise<Booking> {

    const service = await this.serviceRepository.findOne({
      where: { id: dto.serviceId },
    });
    if (!service) {
      throw new NotFoundException(`Service with ID ${dto.serviceId} not found`);
    }

    const bookingDateTime = new Date(
      `${dto.bookingDate}T${dto.bookingTime}:00`,
    );
    if (isNaN(bookingDateTime.getTime())) {
      throw new BadRequestException('Invalid date or time format');
    }
    if (bookingDateTime < new Date()) {
      throw new BadRequestException(
        'Booking date and time cannot be in the past',
      );
    }

    const duplicate = await this.bookingRepository.findOne({
      where: {
        serviceId: dto.serviceId,
        bookingDate: dto.bookingDate, 
        bookingTime: dto.bookingTime, 
        status: Not(BookingStatus.CANCELLED),
      },
    });
    if (duplicate) {
      throw new ConflictException(
        'A booking already exists for this service at the specified date and time',
      );
    }

    const booking = this.bookingRepository.create({ ...dto });
    return this.bookingRepository.save(booking);
  }

  async getAllBookings(): Promise<Booking[]> {
    return this.bookingRepository.find({
      relations: { service: true },
      order: { createdAt: 'DESC' },
    });
  }

  async getBookingById(id: string): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: { service: true },
    });
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    return booking;
  }

  async updateBookingStatus(
    id: string,
    dto: UpdateBookingStatusDto,
  ): Promise<Booking> {
    const booking = await this.getBookingById(id);
    if (
      booking.status === BookingStatus.CANCELLED &&
      dto.status === BookingStatus.COMPLETED
    ) {
      throw new BadRequestException(
        'A cancelled booking cannot be marked as completed',
      );
    }

    booking.status = dto.status;
    return this.bookingRepository.save(booking);
  }

  async cancelBooking(id: string): Promise<{message: string}> {
    const booking = await this.getBookingById(id);

    if (booking.status === BookingStatus.COMPLETED) {
      throw new BadRequestException('Completed bookings cannot be cancelled');
    }

    booking.status = BookingStatus.CANCELLED;
    await this.bookingRepository.save(booking);
    return { message: 'Booking cancelled successfully' };
  }

  async getBookingsByStatus(status: BookingStatus): Promise<Booking[]> {
    return this.bookingRepository.find({
      where: { status },
      relations: { service: true },
      order: { createdAt: 'DESC' },
    });
  }
}
