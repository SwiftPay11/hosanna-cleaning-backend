import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  create(data: { name: string; rating: number; comment: string }) {
    return this.prisma.review.create({ data });
  }

  findAll() {
    return this.prisma.review.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
