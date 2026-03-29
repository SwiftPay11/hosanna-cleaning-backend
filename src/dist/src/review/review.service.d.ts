import { PrismaService } from '../prisma/prisma.service';
export declare class ReviewService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
        name: string;
        rating: number;
        comment: string;
    }): import(".prisma/client").Prisma.Prisma__ReviewClient<{
        id: string;
        createdAt: Date;
        name: string | null;
        rating: number;
        comment: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        name: string | null;
        rating: number;
        comment: string;
    }[]>;
}
