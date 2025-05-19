import { Module } from '@nestjs/common';
import { RewardController } from './reward.controller';
import { RewardService } from './reward.service';
import { RewardModelModule } from './schemas/reward.schema';
import { RewardRequestModelModule } from './schemas/reward-request.schema';
import { ReceivedRewardModelModule } from './schemas/received-reward-log.schema';
import { EventModelModule } from '../event/schemas/event.schema';
import { AttendanceLogModelModule } from '../attendance/schemas/attendance-log.schema';
import { UserModelModule } from '../user/schemas/user.schema';

@Module({
  imports: [
    RewardModelModule,
    RewardRequestModelModule,
    ReceivedRewardModelModule,
    EventModelModule,
    AttendanceLogModelModule,
    UserModelModule,
  ],
  controllers: [RewardController],
  providers: [RewardService],
  exports: [RewardService],
})
export class RewardModule {}
