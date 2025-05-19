import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { SchemaTimestamps, UserRole } from '@event-rewards-platform/common';
import { Reward } from './reward.schema';

@Schema({ timestamps: true })
export class ReceivedReward {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users' })
  userId: mongoose.Types.ObjectId;

  // 이벤트 정보
  @Prop({ type: Object, required: true })
  event: Reward;

  // 받은 보상 정보
  @Prop({ type: Object, required: true })
  reward: {
    // Reward 스키마에도 Event가 포함되어 있으므로, Reward 스키마 참조 하지 않음.
    _id: mongoose.Types.ObjectId;
    name: string;
    type: string;
    quantity: number;
  };

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'RewardRequest' })
  rewardRequestId: mongoose.Types.ObjectId;

  // 보상 지급 처리자, USER 라면 자동 지급된 보상
  @Prop({
    type: String,
    enum: UserRole,
    default: UserRole.USER,
  })
  processedBy: UserRole;
}

export const ReceivedRewardLogSchema =
  SchemaFactory.createForClass(ReceivedReward);

export type ReceivedRewardLogDocument = HydratedDocument<ReceivedReward> &
  SchemaTimestamps;

export const ReceivedRewardModelModule = MongooseModule.forFeature([
  {
    name: ReceivedReward.name,
    schema: ReceivedRewardLogSchema,
  },
]);
