import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from '../database/entities/service.entity';
import { CreateServiceDto, UpdateServiceDto } from './dto/service.dto';
import { User } from '../database/entities/user.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
  ) {}

  async createService(dto: CreateServiceDto, userId: string): Promise<Service> {
    const service = this.serviceRepository.create({
      ...dto,
      createdById: userId,
    });
    return this.serviceRepository.save(service);
  }

  async getAllServices(): Promise<Service[]> {
    return this.serviceRepository.find({ relations: { createdBy: true } });
  }

  async getServiceById(id: string): Promise<Service> {
    const service = await this.serviceRepository.findOne({
      where: { id },
      relations: { createdBy: true },
    });
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return service;
  }

  async updateService(
    id: string,
    dto: UpdateServiceDto,
    user: User,
  ): Promise<Service> {
    const service = await this.getServiceById(id);
    if (service.createdById !== user.id) {
      throw new ForbiddenException('You are not the owner of this service');
    }
    Object.assign(service, dto);
    return this.serviceRepository.save(service);
  }
  async deleteService(id: string, user: User): Promise<{ message: string }> {
    const service = await this.getServiceById(id);
    if (service.createdById !== user.id) {
      throw new ForbiddenException('You are not the owner of this service');
    }
    await this.serviceRepository.remove(service);
    return { message: 'Service deleted successfully' };
  }
}
