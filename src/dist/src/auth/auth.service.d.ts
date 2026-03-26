import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { EmailService } from 'src/email/email.service';
export declare class AuthService {
    private prisma;
    private emailService;
    private jwtService;
    constructor(prisma: PrismaService, emailService: EmailService, jwtService: JwtService);
    register(data: RegisterDto): Promise<{
        message: string;
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
    }>;
    getMe(userId: string): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
    } | null>;
    login(email: string, password: string): Promise<{
        access_token: string;
    }>;
}
