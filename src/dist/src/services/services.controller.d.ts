import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
export declare class ServicesController {
    private readonly servicesService;
    constructor(servicesService: ServicesService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        description: string;
        price: number;
        active: boolean;
    }[]>;
    create(data: CreateServiceDto): import(".prisma/client").Prisma.Prisma__ServiceClient<{
        id: string;
        name: string;
        description: string;
        price: number;
        active: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, data: UpdateServiceDto): import(".prisma/client").Prisma.Prisma__ServiceClient<{
        id: string;
        name: string;
        description: string;
        price: number;
        active: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(id: string): import(".prisma/client").Prisma.Prisma__ServiceClient<{
        id: string;
        name: string;
        description: string;
        price: number;
        active: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
