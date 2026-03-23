import { Controller, Get, Post, Body } from '@nestjs/common';
import { ReviewService } from './review.service';

@Controller('reviews')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @Post()
  create(@Body() body: any) {
    return this.reviewService.create(body);
  }

  @Get()
  findAll() {
    return this.reviewService.findAll();
  }
}