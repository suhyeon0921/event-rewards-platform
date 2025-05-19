import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { SchemaTimestamps } from '@event-rewards-platform/common';

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ type: Object, required: true })
  conditions: {
    type: string; // 'ATTENDANCE', 'CONTEST'
    details: Record<string, any>; // 조건별 세부 사항
  };

  @Prop({ default: true })
  isAutoReward: boolean;
}

export const EventSchema = SchemaFactory.createForClass(Event);

export type EventDocument = HydratedDocument<Event> & SchemaTimestamps;

export const EventModelModule = MongooseModule.forFeature([
  {
    name: Event.name,
    schema: EventSchema,
  },
]);
