import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { SchemaTimestamps } from '@event-rewards-platform/common';

export enum EventConditionType {
  ATTENDANCE = 'ATTENDANCE',
  CONTEST = 'CONTEST',
}

export interface AttendanceCondition {
  requiredDays: number; // 출석 필요 일수
}

export interface ContestCondition {
  minScore: number; // 최소 점수
  rankCutoff?: number; // 순위 커트라인 (상위 N등까지)
}

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
    type: EventConditionType;
    details: AttendanceCondition | ContestCondition;
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
