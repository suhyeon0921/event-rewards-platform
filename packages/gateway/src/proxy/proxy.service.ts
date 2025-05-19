import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import * as httpProxy from 'http-proxy';

@Injectable()
export class ProxyService {
  private proxy: httpProxy;

  constructor(private configService: ConfigService) {
    this.proxy = httpProxy.createProxyServer({
      timeout: 10000, // 타임아웃 설정
      proxyTimeout: 10000, // 프록시 타임아웃 설정
      changeOrigin: true, // Origin 헤더 변경
    });

    // 에러 핸들링
    this.proxy.on('error', (err, req, res) => {
      console.error('프록시 에러:', err);
      const response = res as Response;
      if (!response.headersSent) {
        response.writeHead(500, { 'Content-Type': 'application/json' });
        response.end(
          JSON.stringify({
            message: '서비스 연결 오류가 발생했습니다.',
            error: err.message,
          }),
        );
      }
    });

    // 프록시 요청 로깅
    this.proxy.on('proxyReq', (proxyReq, req: any) => {
      // Express에서 이미 파싱된 본문이 있는 경우 직접 처리
      if (req.body && Object.keys(req.body).length > 0) {
        const bodyData = JSON.stringify(req.body);

        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.write(bodyData);
      }
    });
  }

  // Auth 서비스로 요청 라우팅
  routeToAuthService(req: Request, res: Response): void {
    const authServiceUrl =
      this.configService.getOrThrow<string>('AUTH_SERVICE_URL');
    this.routeToService(authServiceUrl, req, res);
  }

  // Event 서비스로 요청 라우팅
  routeToEventService(req: Request, res: Response): void {
    const eventServiceUrl =
      this.configService.getOrThrow<string>('EVENT_SERVICE_URL');
    this.routeToService(eventServiceUrl, req, res);
  }

  // 공통 라우팅 로직을 처리하는 메서드
  private routeToService(
    serviceUrl: string,
    req: Request,
    res: Response,
  ): void {
    const originalUrl = req.url;
    req.url = req.url.replace(/\/proxy/, '');

    this.proxy.web(req, res, {
      target: serviceUrl,
      changeOrigin: true,
      timeout: 5000, // 요청 타임아웃
      proxyTimeout: 5000, // 프록시 타임아웃
    });
  }
}
