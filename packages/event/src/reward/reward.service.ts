import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Reward, RewardDocument } from './schemas/reward.schema';
import {
  RewardRequest,
  RewardRequestDocument,
} from './schemas/reward-request.schema';
import {
  ReceivedReward,
  ReceivedRewardLogDocument,
} from './schemas/received-reward-log.schema';
import { CreateRewardDto } from './dto/create-reward.dto';
import { RequestRewardDto } from './dto/request-reward.dto';
import {
  AttendanceCondition,
  Event,
  EventDocument,
} from '../event/schemas/event.schema';
import { UserRole } from '@event-rewards-platform/common';
import {
  AttendanceLog,
  AttendanceLogDocument,
} from '../attendance/schemas/attendance-log.schema';
import { User, UserDocument } from '../user/schemas/user.schema';

@Injectable()
export class RewardService {
  constructor(
    @InjectModel(Reward.name)
    private rewardModel: Model<RewardDocument>,
    @InjectModel(RewardRequest.name)
    private rewardRequestModel: Model<RewardRequestDocument>,
    @InjectModel(ReceivedReward.name)
    private receivedRewardLogModel: Model<ReceivedRewardLogDocument>,
    @InjectModel(Event.name)
    private eventModel: Model<EventDocument>,
    @InjectModel(AttendanceLog.name)
    private attendanceLogModel: Model<AttendanceLogDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  // 보상 생성
  async createReward(
    eventName: string,
    createRewardDto: CreateRewardDto,
  ): Promise<RewardDocument> {
    // 이벤트 존재 여부 확인
    const event: EventDocument = await this.findEventByNameOrThrow(eventName);

    // 보상 생성
    return this.rewardModel.create({
      ...createRewardDto,
      event,
    });
  }

  // 이벤트별 보상 조회
  async getRewardsByEvent(eventName: string): Promise<RewardDocument[]> {
    // 이벤트 존재 여부 확인
    const event: EventDocument = await this.findEventByNameOrThrow(eventName);

    return this.rewardModel
      .find({ 'event._id': new Types.ObjectId(event.id) })
      .exec();
  }

  // 모든 보상 조회
  async getAllRewards(): Promise<RewardDocument[]> {
    return this.rewardModel.find();
  }

  // 보상 요청
  async requestReward(
    userId: string,
    requestRewardDto: RequestRewardDto,
  ): Promise<RewardRequestDocument> {
    const { eventName, rewardName } = requestRewardDto;

    // 이벤트와 보상 존재 여부 확인
    const event: EventDocument = await this.findEventByNameOrThrow(eventName);
    const reward: RewardDocument =
      await this.findRewardByNameOrThrow(rewardName);

    // 해당 보상이 이벤트에 연결되어 있는지 확인
    if (reward.event['_id'].toString() !== eventName) {
      throw new BadRequestException(
        '해당 보상은 요청한 이벤트에 연결되어 있지 않습니다.',
      );
    }

    // 중복 요청 체크
    const existingRequest: RewardDocument =
      await this.rewardRequestModel.findOne({
        userId: new Types.ObjectId(userId),
        'event._id': new Types.ObjectId(eventName),
        'reward._id': new Types.ObjectId(rewardName),
        status: { $in: ['PENDING', 'APPROVED', 'CLAIMED'] },
      });
    if (existingRequest) {
      throw new ConflictException('이미 해당 보상에 대한 요청이 존재합니다.');
    }

    // 이벤트 조건 충족 여부 검증
    const conditionsMet = await this.verifyEventConditions(userId, event);

    // 보상 요청 생성
    const rewardRequest: RewardRequestDocument =
      await this.rewardRequestModel.create({
        userId: new Types.ObjectId(userId),
        event,
        reward: {
          _id: reward._id,
          name: reward.name,
          type: reward.type,
          quantity: reward.quantity,
        },
        status: conditionsMet ? 'APPROVED' : 'PENDING',
      });

    // 자동 보상 처리
    if (conditionsMet && event.isAutoReward) {
      await this.processReward(userId, rewardRequest._id.toString());
    }

    return rewardRequest;
  }

  // 유저 요청 보상 요청 리스트
  async getUserRequests(userId: string): Promise<ReceivedRewardLogDocument[]> {
    return this.rewardRequestModel.find({
      userId: new Types.ObjectId(userId),
    });
  }

  async getReceivedRewards(): Promise<ReceivedRewardLogDocument[]> {
    return this.receivedRewardLogModel.find();
  }

  // 이벤트 조건 충족 여부 검증 (실제로는 이벤트 타입에 맞게 구현)
  private async verifyEventConditions(
    userId: string,
    event: EventDocument,
  ): Promise<boolean> {
    // 실제 구현에서는 이벤트 타입과 조건에 따라 다른 검증 로직이 필요
    const { type } = event.conditions;

    switch (type) {
      case 'ATTENDANCE':
        // 연속 출석 체크 조건 검증
        return this.verifyAttendanceCondition(userId, event);

      case 'CONTEST':
        // TODO: 컨테스트 점수/순위 확인 로직 구현
        return true; // 임시 구현

      default:
        return false;
    }
  }

  // 이벤트 출석 조건 충족 여부 확인
  private async verifyAttendanceCondition(
    userId: string,
    event: EventDocument,
  ): Promise<boolean> {
    if (!event.conditions || event.conditions.type !== 'ATTENDANCE') {
      return false;
    }

    const { requiredDays } = event.conditions.details as AttendanceCondition;

    // 연속 출석 조건인 경우
    const consecutiveDays: number = await this.getConsecutiveDays(userId);
    return consecutiveDays >= requiredDays;
  }

  // 사용자의 연속 출석 일수 확인
  private async getConsecutiveDays(userId: string): Promise<number> {
    const latestLog = await this.attendanceLogModel
      .findOne({
        userId: new Types.ObjectId(userId),
      })
      .sort({ attendanceDate: -1 });

    return latestLog ? latestLog.consecutiveDays : 0;
  }

  // 보상 처리 (APPROVED → CLAIMED 상태로 변경 및 ReceivedReward 생성)
  private async processReward(
    userId: string,
    requestId: string,
  ): Promise<ReceivedRewardLogDocument> {
    const request: RewardRequestDocument =
      await this.rewardRequestModel.findById(requestId);
    if (!request || request.status !== 'APPROVED') {
      return;
    }

    // 상태 업데이트
    request.status = 'CLAIMED';
    await request.save();

    // 유저에게 보상 지급
    const user: UserDocument = await this.userModel.findById(request.userId);
    const updatedCoin = user.coins + request.reward.quantity;
    await this.userModel.findOneAndUpdate(
      { _id: userId },
      { $inc: { coins: updatedCoin } },
    );

    // 받은 보상 기록
    return this.receivedRewardLogModel.create({
      userId: request.userId,
      event: request.event,
      reward: request.reward,
      rewardRequestId: request._id,
      processedBy: UserRole.USER, // 자동 처리는 USER 권한으로 처리
    });
  }

  private async findEventByNameOrThrow(
    eventName: string,
  ): Promise<EventDocument> {
    const event: EventDocument = await this.eventModel.findOne({
      name: eventName,
    });
    if (!event) {
      throw new NotFoundException(
        `이벤트 이름 ${eventName}를 찾을 수 없습니다.`,
      );
    }

    return event;
  }

  private async findRewardByNameOrThrow(
    rewardName: string,
  ): Promise<RewardDocument> {
    const reward: RewardDocument = await this.rewardModel.findOne({
      name: rewardName,
    });
    if (!reward) {
      throw new NotFoundException(
        `보상 이름 ${rewardName}를 찾을 수 없습니다.`,
      );
    }

    return reward;
  }
}
