import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
export declare class AppController {
    private readonly appService;
    private prisma;
    constructor(appService: AppService, prisma: PrismaService);
    getHello(): string;
    test(): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
    }[]>;
}
