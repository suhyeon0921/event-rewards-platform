import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { RewardType } from '@event-rewards-platform/common';

export class CreateRewardDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(RewardType)
  @IsNotEmpty()
  type: RewardType;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  quantity: number;
}
