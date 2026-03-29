import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(req: any, dto: CreateOrderDto): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            phone: string;
            password: string;
            role: import(".prisma/client").$Enums.Role;
            createdAt: Date;
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
        id: string;
        createdAt: Date;
        address: string | null;
        status: import(".prisma/client").$Enums.OrderStatus;
        total: number;
        scheduleDate: string | null;
        explanation: string | null;
        userId: string;
    }>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            phone: string;
            password: string;
            role: import(".prisma/client").$Enums.Role;
            createdAt: Date;
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
        id: string;
        createdAt: Date;
        address: string | null;
        status: import(".prisma/client").$Enums.OrderStatus;
        total: number;
        scheduleDate: string | null;
        explanation: string | null;
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
        id: string;
        createdAt: Date;
        address: string | null;
        status: import(".prisma/client").$Enums.OrderStatus;
        total: number;
        scheduleDate: string | null;
        explanation: string | null;
        userId: string;
    })[]>;
    updateStatus(id: string, dto: UpdateOrderStatusDto, req: any): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            phone: string;
            password: string;
            role: import(".prisma/client").$Enums.Role;
            createdAt: Date;
        };
        items: {
            id: string;
            quantity: number;
            serviceId: string;
            orderId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        address: string | null;
        status: import(".prisma/client").$Enums.OrderStatus;
        total: number;
        scheduleDate: string | null;
        explanation: string | null;
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
            createdAt: Date;
            status: import(".prisma/client").$Enums.OrderStatus;
            changedBy: string;
            orderId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        address: string | null;
        status: import(".prisma/client").$Enums.OrderStatus;
        total: number;
        scheduleDate: string | null;
        explanation: string | null;
        userId: string;
    }) | null>;
}
