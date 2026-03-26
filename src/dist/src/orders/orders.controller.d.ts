import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(req: any, dto: CreateOrderDto): Promise<{
        user: {
            id: string;
            createdAt: Date;
            firstName: string;
            lastName: string;
            email: string;
            phone: string;
            password: string;
            role: import(".prisma/client").$Enums.Role;
        };
        items: ({
            service: {
                id: string;
                name: string;
                description: string;
                price: number;
                active: boolean;
            };
        } & {
            id: string;
            quantity: number;
            serviceId: string;
            orderId: string;
        })[];
    } & {
        address: string | null;
        id: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        total: number;
        scheduleDate: string | null;
        explanation: string | null;
        createdAt: Date;
        userId: string;
    }>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        user: {
            id: string;
            createdAt: Date;
            firstName: string;
            lastName: string;
            email: string;
            phone: string;
            password: string;
            role: import(".prisma/client").$Enums.Role;
        };
        items: ({
            service: {
                id: string;
                name: string;
                description: string;
                price: number;
                active: boolean;
            };
        } & {
            id: string;
            quantity: number;
            serviceId: string;
            orderId: string;
        })[];
    } & {
        address: string | null;
        id: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        total: number;
        scheduleDate: string | null;
        explanation: string | null;
        createdAt: Date;
        userId: string;
    })[]>;
    getMyOrders(req: any): import(".prisma/client").Prisma.PrismaPromise<({
        items: {
            id: string;
            quantity: number;
            serviceId: string;
            orderId: string;
        }[];
    } & {
        address: string | null;
        id: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        total: number;
        scheduleDate: string | null;
        explanation: string | null;
        createdAt: Date;
        userId: string;
    })[]>;
    updateStatus(id: string, dto: UpdateOrderStatusDto, req: any): Promise<{
        user: {
            id: string;
            createdAt: Date;
            firstName: string;
            lastName: string;
            email: string;
            phone: string;
            password: string;
            role: import(".prisma/client").$Enums.Role;
        };
        items: {
            id: string;
            quantity: number;
            serviceId: string;
            orderId: string;
        }[];
    } & {
        address: string | null;
        id: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        total: number;
        scheduleDate: string | null;
        explanation: string | null;
        createdAt: Date;
        userId: string;
    }>;
    getOrder(id: string): Promise<({
        items: {
            id: string;
            quantity: number;
            serviceId: string;
            orderId: string;
        }[];
        history: {
            id: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            createdAt: Date;
            orderId: string;
            changedBy: string;
        }[];
    } & {
        address: string | null;
        id: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        total: number;
        scheduleDate: string | null;
        explanation: string | null;
        createdAt: Date;
        userId: string;
    }) | null>;
}
