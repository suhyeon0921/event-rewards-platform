import { Module, Provider } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModelModule } from '../user/schemas/user.schema';
import { GenerateJwtUtil } from './utils/generate-jwt.util';
import { ConfigService } from '@nestjs/config';

const utilProviders: Provider[] = [GenerateJwtUtil];

@Module({
  imports: [
    UserModelModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.getOrThrow<string>('JWT_EXPIRES_IN'),
          algorithm: 'HS256',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, ...utilProviders],
})
export class AuthModule {}
