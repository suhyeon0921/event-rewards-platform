import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
