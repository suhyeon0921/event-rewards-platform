import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  AttendanceCondition,
  ContestCondition,
  EventConditionType,
} from '../schemas/event.schema';
import { Transform, Type } from 'class-transformer';

export class EventConditionsDto {
  @IsNotEmpty()
  @IsEnum(EventConditionType)
  type: EventConditionType;

  @IsNotEmpty()
  details: AttendanceCondition | ContestCondition;
}

export class CreateEventDto {
  @IsNotEmpty()
  @IsString({ message: '이벤트 이름은 문자열 형식이어야 합니다.' })
  name: string;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  startDate: Date;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  endDate: Date;

  @IsNotEmpty()
  @IsBoolean({ message: '자동 보상 여부는 불리언 형식이어야 합니다.' })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value === 'true';
    }
    return value;
  })
  isAutoReward: boolean;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => EventConditionsDto)
  conditions: EventConditionsDto;
}
