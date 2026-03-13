import { AdminService } from './admin.service';
export declare class AdminController {
    private adminService;
    constructor(adminService: AdminService);
    getDashboard(): Promise<{
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
