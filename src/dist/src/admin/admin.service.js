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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let AdminService = class AdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardStats() {
        const totalRevenue = await this.prisma.order.aggregate({
            _sum: { total: true },
            where: { status: client_1.OrderStatus.COMPLETED },
        });
        const totalOrders = await this.prisma.order.count();
        const pendingOrders = await this.prisma.order.count({
            where: { status: client_1.OrderStatus.PENDING },
        });
        const cleaningOrders = await this.prisma.order.count({
            where: { status: client_1.OrderStatus.CLEANING },
        });
        const completedOrders = await this.prisma.order.count({
            where: { status: client_1.OrderStatus.COMPLETED },
        });
        const cancelledOrders = await this.prisma.order.count({
            where: { status: client_1.OrderStatus.CANCELLED },
        });
        return {
            totalRevenue: totalRevenue._sum.total || 0,
            totalOrders,
            pendingOrders,
            cleaningOrders,
            completedOrders,
            cancelledOrders,
        };
    }
    async getRevenuePerDay() {
        const orders = await this.prisma.order.findMany({
            where: {
                status: 'DELIVERED',
            },
            select: {
                total: true,
                createdAt: true,
            },
        });
        const revenueMap = {};
        for (const order of orders) {
            const date = order.createdAt.toISOString().split('T')[0];
            if (!revenueMap[date]) {
                revenueMap[date] = 0;
            }
            revenueMap[date] += order.total;
        }
        return Object.entries(revenueMap).map(([date, revenue]) => ({
            date,
            revenue,
        }));
    }
    async getMostPopularService() {
        const result = await this.prisma.orderItem.groupBy({
            by: ['serviceId'],
            _sum: {
                quantity: true,
            },
            orderBy: {
                _sum: {
                    quantity: 'desc',
                },
            },
            take: 1,
        });
        if (!result.length)
            return null;
        const service = await this.prisma.service.findUnique({
            where: { id: result[0].serviceId },
        });
        return {
            serviceName: service?.name,
            totalOrders: result[0]._sum.quantity,
        };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map