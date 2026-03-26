import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from '@prisma/client';
import { OrderGateway } from './order.gateway';
import { EmailService } from 'src/email/email.service';
export declare class OrdersService {
    private prisma;
    private emailService;
    private readonly orderGateway;
    constructor(prisma: PrismaService, emailService: EmailService, orderGateway: OrderGateway);
    create(userId: string, dto: CreateOrderDto): Promise<{
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
    findUserOrders(userId: string): import(".prisma/client").Prisma.PrismaPromise<({
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
    updateStatus(id: string, status: OrderStatus, adminId: string): Promise<{
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
    getOrderWithHistory(id: string): Promise<({
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
