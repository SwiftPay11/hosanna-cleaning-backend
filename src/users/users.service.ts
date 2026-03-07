import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

 async create(data: CreateUserDto) {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  return this.prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
      role: data.role as Role, // 🔥 FIX
    },
  });
}

  findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

 update(id: string, data: UpdateUserDto) {
  return this.prisma.user.update({
    where: { id },
    data: {
      ...data,
      role: data.role as Role,
    },
  });
}

  remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
