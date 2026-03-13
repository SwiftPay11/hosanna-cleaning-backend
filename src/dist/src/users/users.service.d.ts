import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: CreateUserDto): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
    }>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string;
        role: import(".prisma/client").$Enums.Role;
    }[]>;
    findOne(id: string): import(".prisma/client").Prisma.Prisma__UserClient<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, data: UpdateUserDto): import(".prisma/client").Prisma.Prisma__UserClient<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(id: string): import(".prisma/client").Prisma.Prisma__UserClient<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
