import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
import { RewardService } from './reward.service';
import { CreateRewardDto } from './dto/create-reward.dto';
import { RequestRewardDto } from './dto/request-reward.dto';
import { RewardDocument } from './schemas/reward.schema';
import { RewardRequestDocument } from './schemas/reward-request.schema';
import { ReceivedRewardLogDocument } from './schemas/received-reward-log.schema';

@Controller('api/v1/rewards')
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  // 보상 등록 (관리자용)
  @Post('events/:eventName')
  createReward(
    @Param('eventName') eventName: string,
    @Body() createRewardDto: CreateRewardDto,
  ): Promise<RewardDocument> {
    return this.rewardService.createReward(eventName, createRewardDto);
  }

  // 이벤트별 보상 조회
  @Get('events/:eventName')
  getRewardsByEvent(
    @Param('eventName') eventName: string,
  ): Promise<RewardDocument[]> {
    return this.rewardService.getRewardsByEvent(eventName);
  }

  // 모든 보상 조회
  @Get()
  getAllRewards(): Promise<RewardDocument[]> {
    return this.rewardService.getAllRewards();
  }

  @Get('received')
  getReceivedRewards(): Promise<ReceivedRewardLogDocument[]> {
    return this.rewardService.getReceivedRewards();
  }

  // 유저 보상 요청
  @Post('users/requests')
  requestReward(
    @Headers('x-user-id') userId: string,
    @Body() requestRewardDto: RequestRewardDto,
  ): Promise<RewardRequestDocument> {
    return this.rewardService.requestReward(userId, requestRewardDto);
  }

  // 유저 요청 보상 요청 리스트 조회
  @Get('users/requests')
  getUserRequests(@Headers('x-user-id') userId: string) {
    return this.rewardService.getUserRequests(userId);
  }
}
