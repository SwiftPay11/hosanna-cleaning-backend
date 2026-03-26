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

      await this.emailService.sendMail(
        user.email,
        "Welcome to Hosanna Cleaning 🎉",
        `<h2>Welcome ${user.firstName}</h2>
   <p>Your account has been created successfully.</p>`,
      );

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

  async login(email: string, password: string) {
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
      "Login Alert",
      `<p>Hello ${user.firstName}, you just logged in.</p>`,
    );

    return { access_token: token };
  }
}
