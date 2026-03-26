import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ServicesModule } from './services/services.module';
import { OrdersModule } from './orders/orders.module';
import { AdminModule } from './admin/admin.module';
import { ReviewModule } from './review/review.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, ServicesModule, OrdersModule, AdminModule, ReviewModule, EmailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
