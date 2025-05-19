import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { SchemaTimestamps } from '@event-rewards-platform/common';
import { Event } from '../../event/schemas/event.schema';

@Schema({ timestamps: true })
export class RewardRequest {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users' })
  userId: mongoose.Types.ObjectId;

  @Prop({ type: Event, required: true })
  event: Event;

  @Prop({ type: Object, required: true })
  reward: {
    // Reward 스키마에도 Event가 포함되어 있으므로, Reward 스키마 참조 하지 않음.
    _id: mongoose.Types.ObjectId;
    name: string;
    type: string;
    quantity: number;
  };

  @Prop({
    required: true,
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'CLAIMED'],
    default: 'PENDING',
  })
  status: string;
}

export const RewardRequestSchema = SchemaFactory.createForClass(RewardRequest);

export type RewardRequestDocument = HydratedDocument<RewardRequest> &
  SchemaTimestamps;

export const RewardRequestModelModule = MongooseModule.forFeature([
  {
    name: RewardRequest.name,
    schema: RewardRequestSchema,
  },
]);
