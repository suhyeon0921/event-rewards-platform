import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AuthModule } from './auth/auth.module';
import { ProxyModule } from './proxy/proxy.module';

const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('dev', 'prod').default('dev'),
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'prod' ? '.env.prod' : '.env.dev',
      validationSchema,
      validationOptions: {
        abortEarly: false,
      },
    }),
    AuthModule,
    ProxyModule,
  ],
})
export class AppModule {}
