import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('dashboard')
  @Roles(Role.ADMIN)
  getDashboard() {
    return this.adminService.getDashboardStats();
  }

  @Get('revenue-per-day')
  @Roles(Role.ADMIN)
  getRevenuePerDay() {
    return this.adminService.getRevenuePerDay();
  }

  @Get('most-popular-service')
  @Roles(Role.ADMIN)
  getMostPopularService() {
    return this.adminService.getMostPopularService();
  }
}
