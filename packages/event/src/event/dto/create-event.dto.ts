import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsObject,
  IsString,
} from 'class-validator';

export class CreateEventDto {
  @IsNotEmpty()
  @IsString({ message: '이벤트 이름은 문자열 형식이어야 합니다.' })
  name: string;

  @IsNotEmpty()
  @IsDate({ message: '시작 날짜는 날짜 형식이어야 합니다.' })
  startDate: Date;

  @IsNotEmpty()
  @IsDate({ message: '종료 날짜는 날짜 형식이어야 합니다.' })
  endDate: Date;

  @IsNotEmpty()
  @IsBoolean({ message: '자동 보상 여부는 불리언 형식이어야 합니다.' })
  isAutoReward: boolean;

  @IsNotEmpty()
  @IsObject({ message: '조건은 객체 형식이어야 합니다.' })
  conditions: Record<string, any>;
}
