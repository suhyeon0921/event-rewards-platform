import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { SchemaTimestamps } from '@event-rewards-platform/common';

@Schema({ timestamps: true })
export class AttendanceLog {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users' })
  userId: mongoose.Types.ObjectId;
  
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Event' })
  eventId: mongoose.Types.ObjectId;
  
  @Prop({ required: true, default: Date.now })
  attendanceDate: Date;
  
  @Prop({ default: 1 })
  consecutiveDays: number;
}

export const AttendanceLogSchema = SchemaFactory.createForClass(AttendanceLog);

export type AttendanceLogDocument = HydratedDocument<AttendanceLog> & SchemaTimestamps;

export const AttendanceLogModelModule = MongooseModule.forFeature([
  {
    name: AttendanceLog.name, 
    schema: AttendanceLogSchema,
  },
]);