import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  Patch,
  Param,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { UpdateOrderStatusDto } from './dto/update-order-status';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // User creates order
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(req.user.userId, dto);
  }

  // Admin sees all orders
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  // User sees their own orders
  @Get('my')
  @UseGuards(JwtAuthGuard)
  getMyOrders(@Req() req) {
    return this.ordersService.findUserOrders(req.user.userId);
  }

@Patch(':id/status')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
updateStatus(
  @Param('id') id: string,
  @Body() dto: UpdateOrderStatusDto,
  @Req() req,
) {
  return this.ordersService.updateStatus(
    id,
    dto.status,
    req.user.userId,
  );
}

@Get(':id')
@UseGuards(JwtAuthGuard)
getOrder(@Param('id') id: string) {
  return this.ordersService.getOrderWithHistory(id);
  }
}
