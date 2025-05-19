import { IsBoolean, IsObject, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { EventConditionsDto } from './create-event.dto';

export class UpdateEventDto {
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  startDate?: Date;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  endDate?: Date;

  @IsOptional()
  @IsBoolean({ message: '자동 보상 여부는 불리언 형식이어야 합니다.' })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value === 'true';
    }
    return value;
  })
  isAutoReward?: boolean;

  @IsOptional()
  @IsObject({ message: '조건은 객체 형식이어야 합니다.' })
  conditions?: EventConditionsDto;
}
