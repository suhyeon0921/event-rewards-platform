import { Body, Controller, Headers, Post } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceLogDocument } from './schemas/attendance-log.schema';

@Controller('api/v1/attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  // 출석 체크 API
  @Post()
  checkAttendance(
    @Headers('x-user-id') userId: string,
  ): Promise<AttendanceLogDocument> {
    return this.attendanceService.checkAttendance(userId);
  }

  @Post('admin')
  adminSetAttendance(
    @Headers('x-user-id') userId: string,
    @Body() body: { consecutiveDays: number },
  ): Promise<AttendanceLogDocument> {
    return this.attendanceService.checkAttendanceAdmin(
      userId,
      body.consecutiveDays,
    );
  }
}
