import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@event-rewards-platform/common';

export class SignupDto {
  @ApiProperty({ description: '사용자명' })
  @IsNotEmpty({ message: '사용자명은 필수입니다.' })
  @MinLength(3, { message: '사용자명은 최소 3자 이상이어야 합니다.' })
  @IsString()
  username: string;

  @ApiProperty({ description: '이메일' })
  @IsEmail({}, { message: '유효한 이메일 형식이어야 합니다.' })
  @IsNotEmpty({ message: '이메일은 필수입니다.' })
  @IsString()
  email: string;

  @ApiProperty({ description: '비밀번호' })
  @IsNotEmpty({ message: '비밀번호는 필수입니다.' })
  @MinLength(6, { message: '비밀번호는 최소 6자 이상이어야 합니다.' })
  @IsString()
  password: string;

  @ApiProperty({
    description: '사용자 역할',
    enum: UserRole,
    default: UserRole.USER,
  })
  @IsOptional({ message: '입력하지 않으면 기본값으로 USER 역할이 부여됩니다.' })
  @IsEnum(UserRole, { message: '유효한 사용자 역할이어야 합니다.' })
  role: UserRole;
}
