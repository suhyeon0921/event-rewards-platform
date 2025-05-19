import { All, Controller, Req, Res, UseGuards } from '@nestjs/common';
import { ProxyService } from './proxy.service';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/constants/user-role.constants';

@Controller('api/v1/proxy')
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  // Auth 서비스로 라우팅
  @All('auth/*')
  routeToAuthService(@Req() req: Request, @Res() res: Response): void {
    this.proxyService.routeToAuthService(req, res);
  }

  // Event 서비스로 라우팅
  @All(['events', 'events/*', 'rewards/events/*', 'attendance/admin'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OPERATOR, UserRole.ADMIN)
  routeToEventService(@Req() req: Request, @Res() res: Response): void {
    this.proxyService.routeToEventService(req, res);
  }

  @All(['reward/user/*', 'attendance'])
  routeToUserRewardService(@Req() req: Request, @Res() res: Response): void {
    this.proxyService.routeToEventService(req, res);
  }

  @All('rewards/received')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.AUDITOR, UserRole.ADMIN)
  routeToRewardsService(@Req() req: Request, @Res() res: Response): void {
    this.proxyService.routeToEventService(req, res);
  }
}
