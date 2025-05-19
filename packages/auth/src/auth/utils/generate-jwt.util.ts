import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserDocument } from '../../user/schemas/user.schema';

@Injectable()
export class GenerateJwtUtil {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  generateJwtToken(user: UserDocument): string {
    const payload = {
      sub: user.id,
      role: user.role,
      env: this.configService.getOrThrow<string>('NODE_ENV'),
    };
    return this.jwtService.sign(payload);
  }
}
