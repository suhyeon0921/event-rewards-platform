import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class UserAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // 여기에 실제 인증 로직을 구현합니다.
    // 토큰 검증, 사용자 정보 확인 등
    
    // 간단한 예시: 헤더에 Authorization 정보가 있는지 확인
    const auth = request.headers.authorization;
    if (!auth) {
      throw new UnauthorizedException('인증 정보가 필요합니다.');
    }
    
    // 토큰 검증 로직 (실제로는 JWT 검증 등)
    // 여기서는 간단히 헤더가 있는지만 확인하고 통과시킵니다.
    
    return true;
  }
} 