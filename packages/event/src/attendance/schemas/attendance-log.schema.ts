import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { SchemaTimestamps } from '@event-rewards-platform/common';

@Schema({ timestamps: true })
export class AttendanceLog {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  attendanceDate: Date;

  @Prop({ default: false })
  isConsecutive: boolean;

  @Prop({ default: 1 })
  consecutiveDays: number;
}

export const AttendanceLogSchema = SchemaFactory.createForClass(AttendanceLog);

export type AttendanceLogDocument = HydratedDocument<AttendanceLog> &
  SchemaTimestamps;

export const AttendanceLogModelModule = MongooseModule.forFeature([
  {
    name: AttendanceLog.name,
    schema: AttendanceLogSchema,
  },
]);
