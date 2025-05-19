import { All, Controller, Req, Res, UseGuards } from '@nestjs/common';
import { ProxyService } from './proxy.service';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('proxy')
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  // Auth 서비스로 라우팅
  @All('auth/*')
  routeToAuthService(@Req() req: Request, @Res() res: Response): void {
    console.log('Gateway 요청 받음:', req.method, req.url);
    console.log('요청 헤더:', req.headers);

    if (req.body) {
      console.log('요청 본문:', req.body);
    }

    this.proxyService.routeToAuthService(req, res);
  }

  // Event 서비스로 라우팅
  @All('events/*')
  @UseGuards(JwtAuthGuard)
  routeToEventService(@Req() req: Request, @Res() res: Response): void {
    this.proxyService.routeToEventService(req, res);
  }
}
