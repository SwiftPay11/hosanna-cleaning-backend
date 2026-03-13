import { PrismaService } from '../prisma/prisma.service';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboardStats(): Promise<{
        totalRevenue: number;
        totalOrders: number;
        pendingOrders: number;
        cleaningOrders: number;
        completedOrders: number;
        cancelledOrders: number;
    }>;
    getRevenuePerDay(): Promise<{
        date: string;
        revenue: number;
    }[]>;
    getMostPopularService(): Promise<{
        serviceName: string | undefined;
        totalOrders: number | null;
    } | null>;
}
