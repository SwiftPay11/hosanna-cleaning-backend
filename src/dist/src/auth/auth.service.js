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
            try {
                await this.emailService.sendMail(user.email, "🎉 Welcome to Hosanna Global", `
    <div style="background:#0f0f0f; padding:20px; font-family:Arial, sans-serif; color:#ffffff;">
      
      <div style="max-width:600px; margin:auto; background:#1a120d; border-radius:12px; padding:25px; border:1px solid #3a2a21;">
        
        <h2 style="margin-bottom:10px;">🎉 Welcome to Hosanna Global</h2>

        <p style="color:#ccc;">
          Hello <strong>${user.firstName}</strong>,
        </p>

        <p style="color:#ccc;">
          Your account has been created successfully, and you’re now part of Hosanna Global Cleaning Services.
        </p>

        <p style="color:#ccc;">
          You can now book cleaning services, manage your orders, and enjoy a seamless experience with us.
        </p>

        <div style="margin:30px 0; text-align:center;">
          <a 
            href="https://hosannaglobal.co.uk" 
            target="_blank"
            style="
              display:inline-block;
              background:#6b3e26;
              color:#ffffff;
              padding:12px 20px;
              border-radius:8px;
              text-decoration:none;
              font-weight:bold;
            "
          >
            Visit Website
          </a>
        </div>

        <p style="color:#ccc;">
          If you have any questions, feel free to reach out to us anytime.
        </p>

        <hr style="border:none; border-top:1px solid #3a2a21; margin:20px 0;" />

        <p style="font-size:12px; color:#888;">
          Hosanna Global Cleaning Services<br/>
          Delivering excellence, one clean at a time ✨
        </p>

      </div>

    </div>
    `);
            }
            catch (err) {
                console.error("Signup email failed:", err);
            }
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
    async login(email, password, ip, device) {
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
        await this.emailService.sendMail(user.email, "🔐 Login Alert - Hosanna Global", `
  <div style="background:#0f0f0f; padding:20px; font-family:Arial, sans-serif; color:#ffffff;">
    
    <div style="max-width:600px; margin:auto; background:#1a120d; border-radius:12px; padding:25px; border:1px solid #3a2a21;">
      
      <h2 style="margin-bottom:10px;">🔐 Login Alert</h2>

      <p style="color:#ccc;">
        Hello <strong>${user.firstName}</strong>,
      </p>

      <p style="color:#ccc;">
        We detected a new login to your account.
      </p>

      <div style="background:#2b1d16; padding:15px; border-radius:10px; margin:20px 0;">
        
        <p><strong>📍 IP Address:</strong> ${ip}</p>
        <p><strong>💻 Device:</strong> ${device}</p>
        <p><strong>🕒 Time:</strong> ${new Date().toLocaleString()}</p>

      </div>

      <p style="color:#ccc;">
        If this was you, you can safely ignore this email.
      </p>

      <p style="color:#ff4d4f;">
        If you do NOT recognize this activity, please secure your account immediately.
      </p>

      <hr style="border:none; border-top:1px solid #3a2a21; margin:20px 0;" />

      <p style="font-size:12px; color:#888;">
        Hosanna Global Cleaning Services<br/>
        Keeping your account safe 🔒
      </p>

    </div>

  </div>
  `);
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