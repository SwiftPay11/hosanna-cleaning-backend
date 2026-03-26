import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrderGateway } from './order.gateway';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [EmailModule], // ✅ ADD THIS
  controllers: [OrdersController],
  providers: [OrdersService, OrderGateway],
})
export class OrdersModule {}
