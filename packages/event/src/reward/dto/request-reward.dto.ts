import { IsMongoId, IsNotEmpty } from 'class-validator';

export class RequestRewardDto {
  @IsMongoId()
  @IsNotEmpty()
  eventName: string;

  @IsMongoId()
  @IsNotEmpty()
  rewardName: string;
}
