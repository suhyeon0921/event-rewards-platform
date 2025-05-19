import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { SchemaTimestamps, UserRole } from '@event-rewards-platform/common';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    type: String,
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Prop({ type: Number, default: 0 })
  level: number;

  @Prop({ type: Number, default: 0 })
  coins: number;
}

export const UserSchema = SchemaFactory.createForClass(User);

export type UserDocument = HydratedDocument<User> & SchemaTimestamps;

export const UserModelModule = MongooseModule.forFeature([
  {
    name: User.name,
    schema: UserSchema,
  },
]);
