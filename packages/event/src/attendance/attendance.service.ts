import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  AttendanceLog,
  AttendanceLogDocument,
} from './schemas/attendance-log.schema';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectModel(AttendanceLog.name)
    private attendanceLogModel: Model<AttendanceLogDocument>,
  ) {}

  // 사용자 출석 체크
  async checkAttendance(userId: string): Promise<AttendanceLogDocument> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 오늘 이미 출석 체크했는지 확인
    const existingLog = await this.attendanceLogModel.findOne({
      userId: new Types.ObjectId(userId),
      attendanceDate: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    if (existingLog) {
      return existingLog; // 이미 출석 체크 완료
    }

    // 어제 출석했는지 확인 (연속 출석 체크)
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const yesterdayLog = await this.attendanceLogModel.findOne({
      userId: new Types.ObjectId(userId),
      attendanceDate: {
        $gte: yesterday,
        $lt: today,
      },
    });

    let consecutiveDays = 1;
    let isConsecutive = false;

    if (yesterdayLog) {
      consecutiveDays = yesterdayLog.consecutiveDays + 1;
      isConsecutive = true;
    }

    // 새 출석 기록 생성
    return this.attendanceLogModel.create({
      userId: new Types.ObjectId(userId),
      attendanceDate: new Date(),
      isConsecutive,
      consecutiveDays,
    });
  }

  async checkAttendanceAdmin(
    userId: string,
    consecutiveDays: number,
  ): Promise<AttendanceLogDocument> {
    return this.attendanceLogModel.findOneAndUpdate(
      { userId: new Types.ObjectId(userId) },
      { $set: { consecutiveDays: consecutiveDays } },
    );
  }
}
