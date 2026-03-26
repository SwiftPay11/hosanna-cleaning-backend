"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const order_gateway_1 = require("./order.gateway");
const email_service_1 = require("../email/email.service");
let OrdersService = class OrdersService {
    prisma;
    emailService;
    orderGateway;
    constructor(prisma, emailService, orderGateway) {
        this.prisma = prisma;
        this.emailService = emailService;
        this.orderGateway = orderGateway;
    }
    async create(userId, dto) {
        let total = 0;
        for (const item of dto.items) {
            const service = await this.prisma.service.findUnique({
                where: { id: item.serviceId },
            });
            if (!service) {
                throw new common_1.BadRequestException(`Service ${item.serviceId} not found`);
            }
            total += service.price * item.quantity;
        }
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
                    status: client_1.OrderStatus.PENDING,
                    changedBy: userId,
                },
            });
            return createdOrder;
        });
        try {
            await this.emailService.sendMail(order.user.email, "📦 Booking Confirmed - Hosanna Cleaning", `
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
    `);
            await this.emailService.sendMail("hosannaglobalenterprises@gmail.com", "New Booking 🚀", `<p>A new booking has been made.</p>`);
        }
        catch (err) {
            console.error("Email failed:", err);
        }
        return order;
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
    findUserOrders(userId) {
        return this.prisma.order.findMany({
            where: { userId },
            include: {
                items: true,
            },
        });
    }
    async updateStatus(id, status, adminId) {
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
        if (status === client_1.OrderStatus.COMPLETED) {
            try {
                await this.emailService.sendMail(updatedOrder.user.email, "Cleaning Completed 🎉", `<p>Your cleaning service has been completed. Thank you!</p>`);
            }
            catch (err) {
                console.error("Completion email failed:", err);
            }
        }
        return updatedOrder;
    }
    async getOrderWithHistory(id) {
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
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        email_service_1.EmailService,
        order_gateway_1.OrderGateway])
], OrdersService);
//# sourceMappingURL=orders.service.js.map