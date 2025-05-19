import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { RewardType, SchemaTimestamps } from '@event-rewards-platform/common';
import { Event } from '../../event/schemas/event.schema';

@Schema({ timestamps: true })
export class Reward {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({
    enum: RewardType,
    required: true,
  })
  type: RewardType;

  @Prop({ required: true })
  quantity: number;

  @Prop({ type: Event, required: true })
  event: Event;
}

export const RewardSchema = SchemaFactory.createForClass(Reward);

export type RewardDocument = HydratedDocument<Reward> & SchemaTimestamps;

export const RewardModelModule = MongooseModule.forFeature([
  {
    name: Reward.name,
    schema: RewardSchema,
  },
]);
