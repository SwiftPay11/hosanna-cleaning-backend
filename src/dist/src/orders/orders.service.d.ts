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
            serviceId: string;
            quantity: number;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        address: string | null;
        scheduleDate: string | null;
        explanation: string | null;
        userId: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        total: number;
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
            serviceId: string;
            quantity: number;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        address: string | null;
        scheduleDate: string | null;
        explanation: string | null;
        userId: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        total: number;
    })[]>;
    findUserOrders(userId: string): import(".prisma/client").Prisma.PrismaPromise<({
        items: {
            id: string;
            serviceId: string;
            quantity: number;
            orderId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        address: string | null;
        scheduleDate: string | null;
        explanation: string | null;
        userId: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        total: number;
    })[]>;
    updateStatus(id: string, status: OrderStatus, adminId: string): Promise<{
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
            serviceId: string;
            quantity: number;
            orderId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        address: string | null;
        scheduleDate: string | null;
        explanation: string | null;
        userId: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        total: number;
    }>;
    getOrderWithHistory(id: string): Promise<({
        items: {
            id: string;
            serviceId: string;
            quantity: number;
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
        scheduleDate: string | null;
        explanation: string | null;
        userId: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        total: number;
    }) | null>;
}
