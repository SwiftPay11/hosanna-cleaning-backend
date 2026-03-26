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
                    status: client_1.OrderStatus.PENDING,
                    changedBy: userId,
                },
            });
            try {
                await this.emailService.sendMail(order.user.email, "Booking Confirmed ✅", `<h3>Your cleaning service is booked!</h3>`);
                await this.emailService.sendMail("verifyyyouremailaddress@gmail.com", "New Booking 🚀", `<p>A new booking has been made.</p>`);
            }
            catch (err) {
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