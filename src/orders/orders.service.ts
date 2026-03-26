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

    // ✅ CREATE ORDER (TRANSACTION ONLY DB WORK)
    const order = await this.prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
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
          orderId: createdOrder.id,
          status: OrderStatus.PENDING,
          changedBy: userId,
        },
      });

      return createdOrder; // ✅ IMPORTANT
    });

    // ✅ SEND EMAILS (OUTSIDE TRANSACTION — FIXED)
    try {
      // User email
      await this.emailService.sendMail(
        order.user.email,
        "📦 Booking Confirmed - Hosanna Cleaning",
        `
    <div style="background:#0f0f0f; padding:20px; font-family:Arial, sans-serif; color:#ffffff;">
      
      <div style="max-width:600px; margin:auto; background:#1a120d; border-radius:12px; padding:25px; border:1px solid #3a2a21;">
        
        <h2 style="margin-bottom:10px;">📦 Booking Confirmed</h2>

        <p style="color:#ccc;">
          Hello <strong>${order.user.firstName}</strong>,
        </p>

        <p style="color:#ccc;">
          Thank you for choosing Hosanna Global Cleaning Services.
          Your booking has been successfully received and is currently being processed by our team.
        </p>

        <p style="color:#ccc;">
          Our professionals are preparing to deliver a high-quality cleaning experience tailored to your needs.
          You will be notified as your booking progresses.
        </p>

        <div style="background:#2b1d16; padding:15px; border-radius:10px; margin:20px 0;">
          <p><strong>📍 Service Address:</strong> ${order.address || "Not specified"}</p>
          <p><strong>📅 Scheduled Date:</strong> ${order.scheduleDate || "To be confirmed"}</p>
          <p><strong>💰 Total Amount:</strong> $${order.total}</p>
        </div>

        <p style="color:#ccc;">
          You can view and manage your booking at any time through our website.
        </p>

        <div style="margin:30px 0; text-align:center;">
          <a 
            href="https://hosannaglobal.co.uk"
            target="_blank"
            style="
              display:inline-block;
              background:#6b3e26;
              color:#ffffff;
              padding:12px 20px;
              border-radius:8px;
              text-decoration:none;
              font-weight:bold;
            "
          >
            View Booking
          </a>
        </div>

        <p style="color:#ccc;">
          If you have any questions or need assistance, our support team is always ready to help.
        </p>

        <hr style="border:none; border-top:1px solid #3a2a21; margin:20px 0;" />

        <p style="font-size:12px; color:#888;">
          Hosanna Global Cleaning Services<br/>
          Delivering excellence, one clean at a time ✨
        </p>

      </div>

    </div>
    `,
      );

      // Admin email
      await this.emailService.sendMail(
        "hosannaglobalenterprises@gmail.com",
        "New Booking 🚀",
        `<p>A new booking has been made.</p>`,
      );
    } catch (err) {
      console.error("Email failed:", err);
    }

    return order; // ✅ SAME LOGIC, JUST MOVED
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

    this.orderGateway.sendUserUpdate(updatedOrder.userId, updatedOrder);
    this.orderGateway.sendAdminUpdate(updatedOrder);

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