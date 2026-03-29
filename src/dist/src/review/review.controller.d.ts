import { ReviewService } from './review.service';
export declare class ReviewController {
    private reviewService;
    constructor(reviewService: ReviewService);
    create(body: any): import(".prisma/client").Prisma.Prisma__ReviewClient<{
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
