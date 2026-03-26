import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { Prisma } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private jwtService: JwtService,
  ) {}

  async register(data: RegisterDto) {
    try {
      const hashed = await bcrypt.hash(data.password, 10);

      const user = await this.prisma.user.create({
        data: {
          email: data.email,
          password: hashed,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          role: Role.USER,
        },
      });

     try {
  await this.emailService.sendMail(
    user.email,
    "🎉 Welcome to Hosanna Global",
    `
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
    `,
  );
} catch (err) {
  console.error("Signup email failed:", err);
}
      return { message: 'User created', user };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException('Email already exists');
      }

      throw error;
    }
  }

async getMe(userId: string) {
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

  async login(
email: string,
  password: string,
  ip: string,
    device: string,
) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({
      sub: user.id,
      role: user.role,
    });

    await this.emailService.sendMail(
      user.email,
    "🔐 Login Alert - Hosanna Global",
      `
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
  `,
    );

    return { access_token: token };
  }
}
