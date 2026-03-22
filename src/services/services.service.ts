import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateServiceDto) {
    return this.prisma.service.create({ data });
  }

  findAll() {
    return this.prisma.service.findMany();
  }

  findOne(id: string) {
    return this.prisma.service.findUnique({
      where: { id },
    });
  }

  update(id: string, data: UpdateServiceDto) {
    return this.prisma.service.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.service.delete({
      where: { id },
    });
  }
}
