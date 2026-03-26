import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from '@prisma/client';
import { OrderGateway } from './order.gateway';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private readonly orderGateway: OrderGateway,
  ) {}

  async create(userId: string, dto: CreateOrderDto) {
    let total = 0;

    // Validate services and calculate total
    for (const item of dto.items) {
      const service = await this.prisma.service.findUnique({
        where: { id: item.serviceId },
      });

      if (!service) {
        throw new BadRequestException(
          `Service ${item.serviceId} not found`,
        );
      }

      total += service.price * item.quantity;
    }

    // Create order
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId,
          total,
          address: dto.address || null,
          scheduleDate: dto.scheduleDate || null,
          explanation: dto.explanation || null,

          items: {
            create: dto.items.map(item => ({
              serviceId: item.serviceId,
              quantity: item.quantity,
            })),
          },
        },
        include: {
          items: {
            include: {
              service: true,
            },
          },
          user: true,
        },
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId: order.id,
          status: OrderStatus.PENDING,
          changedBy: userId,
        },
      });

      // ✅ SEND EMAILS (SAFE - WON'T BREAK ORDER)
      try {
        // User email
        await this.emailService.sendMail(
          order.user.email,
          "Booking Confirmed ✅",
          `<h3>Your cleaning service is booked!</h3>`
        );

        // Admin email
        await this.emailService.sendMail(
          "verifyyyouremailaddress@gmail.com",
          "New Booking 🚀",
          `<p>A new booking has been made.</p>`
        );
      } catch (err) {
        console.error("Email failed:", err);
      }

      return order;
    });
  }

  findAll() {
    return this.prisma.order.findMany({
      include: {
        user: true,
        items: {
          include: {
            service: true,
          },
        },
      },
    });
  }

  findUserOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: true,
      },
    });
  }

  async updateStatus(
    id: string,
    status: OrderStatus,
    adminId: string,
  ) {
    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: { status },
      include: {
        user: true,
        items: true,
      },
    });

    await this.prisma.orderStatusHistory.create({
      data: {
        orderId: id,
        status,
        changedBy: adminId,
      },
    });

    // notify the specific user
    this.orderGateway.sendUserUpdate(updatedOrder.userId, updatedOrder);

    // notify admins
    this.orderGateway.sendAdminUpdate(updatedOrder);

    // ✅ SEND COMPLETION EMAIL
    if (status === OrderStatus.COMPLETED) {
      try {
        await this.emailService.sendMail(
          updatedOrder.user.email,
          "Cleaning Completed 🎉",
          `<p>Your cleaning service has been completed. Thank you!</p>`,
        );
      } catch (err) {
        console.error("Completion email failed:", err);
      }
    }

    return updatedOrder;
  }

  async getOrderWithHistory(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        history: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }
}
