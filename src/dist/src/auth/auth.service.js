"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const common_2 = require("@nestjs/common");
const client_2 = require("@prisma/client");
const email_service_1 = require("../email/email.service");
let AuthService = class AuthService {
    prisma;
    emailService;
    jwtService;
    constructor(prisma, emailService, jwtService) {
        this.prisma = prisma;
        this.emailService = emailService;
        this.jwtService = jwtService;
    }
    async register(data) {
        try {
            const hashed = await bcrypt.hash(data.password, 10);
            const user = await this.prisma.user.create({
                data: {
                    email: data.email,
                    password: hashed,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    phone: data.phone,
                    role: client_2.Role.USER,
                },
            });
            await this.emailService.sendMail(user.email, "Welcome to Hosanna Cleaning 🎉", `<h2>Welcome ${user.firstName}</h2>
   <p>Your account has been created successfully.</p>`);
            return { message: 'User created', user };
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002') {
                throw new common_2.BadRequestException('Email already exists');
            }
            throw error;
        }
    }
    async getMe(userId) {
        return this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
            },
        });
    }
    async login(email, password) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const valid = await bcrypt.compare(password, user.password);
        if (!valid)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const token = this.jwtService.sign({
            sub: user.id,
            role: user.role,
        });
        await this.emailService.sendMail(user.email, "Login Alert", `<p>Hello ${user.firstName}, you just logged in.</p>`);
        return { access_token: token };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        email_service_1.EmailService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map