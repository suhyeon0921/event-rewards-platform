import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument } from './schemas/event.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name)
    private eventModel: Model<EventDocument>,
  ) {}

  async createEvent(createEventDto: CreateEventDto): Promise<EventDocument> {
    const existingEvent = await this.eventModel.findOne({
      name: createEventDto.name,
    });
    if (existingEvent) {
      throw new BadRequestException('이미 존재하는 이벤트입니다.');
    }

    return await this.eventModel.create(createEventDto);
  }

  async getEvents(): Promise<EventDocument[]> {
    return this.eventModel.find();
  }

  async getEventByName(name: string): Promise<EventDocument> {
    return this.eventModel.findOne({ name });
  }

  async updateEvent(
    name: string,
    updateEventDto: UpdateEventDto,
  ): Promise<EventDocument> {
    return this.eventModel.findOneAndUpdate({ name }, updateEventDto, {
      new: true,
    });
  }

  async deleteEvent(name: string): Promise<EventDocument> {
    return this.eventModel.findOneAndUpdate(
      { name, deletedAt: null },
      { deletedAt: new Date() },
      { new: true },
    );
  }
}
