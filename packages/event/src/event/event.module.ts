import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { EventModelModule } from './schemas/event.schema';

@Module({
  imports: [EventModelModule],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
