import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { EventDocument } from './schemas/event.schema';
import { UpdateEventDto } from './dto/update-event.dto';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  async createEvent(@Body() createEventDto: CreateEventDto) {
    return this.eventService.createEvent(createEventDto);
  }

  @Get()
  async getEvents(): Promise<EventDocument[]> {
    return this.eventService.getEvents();
  }

  @Get(':name')
  async getEventByName(@Param('name') name: string): Promise<EventDocument> {
    return this.eventService.getEventByName(name);
  }

  @Put(':name')
  async updateEvent(
    @Param('name') name: string,
    @Body() updateEventDto: UpdateEventDto,
  ): Promise<EventDocument> {
    return this.eventService.updateEvent(name, updateEventDto);
  }

  @Delete(':name')
  async deleteEvent(@Param('name') name: string): Promise<EventDocument> {
    return this.eventService.deleteEvent(name);
  }
}
