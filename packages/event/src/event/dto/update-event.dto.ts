import { IsDate, IsBoolean, IsObject, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateEventDto {
  @IsOptional()
  @IsDate({ message: '시작 날짜는 날짜 형식이어야 합니다.' })
  startDate?: Date;

  @IsOptional()
  @IsDate({ message: '종료 날짜는 날짜 형식이어야 합니다.' })
  endDate?: Date;

  @IsOptional()
  @IsBoolean({ message: '자동 보상 여부는 불리언 형식이어야 합니다.' })
  isAutoReward?: Boolean;

  @IsOptional()
  @IsObject({ message: '조건은 객체 형식이어야 합니다.' })
  conditions?: Record<string, any>;
}
