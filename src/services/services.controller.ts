import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto, UpdateServiceDto } from './dto/service.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { User } from '../database/entities/user.entity';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import {
  ApiBearerAuth,
  ApiTags,
  ApiParam,
  ApiOperation,
} from '@nestjs/swagger';

@ApiTags('services')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new service (authenticated users only)' })
  createService(@Body() dto: CreateServiceDto, @CurrentUser() user: User) {
    return this.servicesService.createService(dto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all services' })
  getAllServices() {
    return this.servicesService.getAllServices();
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'Service ID', type: 'string' })
  getServiceById(@Param('id', ParseUUIDPipe) id: string) {
    return this.servicesService.getServiceById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Service ID', type: 'string' })
  @ApiOperation({ summary: 'Update a service (authenticated users only)' })
  updateService(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateServiceDto,
    @CurrentUser() user: User,
  ) {
    return this.servicesService.updateService(id, dto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Service ID', type: 'string' })
  @ApiOperation({ summary: 'Delete a service (authenticated users only)' })
  deleteService(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return this.servicesService.deleteService(id, user);
  }
}
