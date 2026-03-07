import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrderGateway } from './order.gateway';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, OrderGateway],
})
export class OrdersModule {}
