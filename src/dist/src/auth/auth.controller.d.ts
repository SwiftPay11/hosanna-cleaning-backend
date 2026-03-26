import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    getMe(req: any): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
    } | null>;
    register(body: RegisterDto): Promise<{
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
    login(body: LoginDto): Promise<{
        access_token: string;
    }>;
}
