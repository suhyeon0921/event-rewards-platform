import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../user/schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { GenerateJwtUtil } from './utils/generate-jwt.util';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly generateJwtUtil: GenerateJwtUtil,
  ) {}

  async signup(signupDto: SignupDto): Promise<{ message: string }> {
    const { username, email, password, role } = signupDto;

    const existingUser = await this.userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      throw new BadRequestException('사용자명 또는 이메일이 이미 존재합니다.');
    }

    const hashedPassword: string = await bcrypt.hash(password, 10);
    await this.userModel.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    return {
      message: '회원가입이 완료되었습니다. 로그인해주세요.',
    };
  }

  async login(loginDto: LoginDto): Promise<string> {
    const { email, password } = loginDto;

    const user: UserDocument = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 올바르지 않습니다.',
      );
    }

    const isPasswordValid: boolean = await bcrypt.compare(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 올바르지 않습니다.',
      );
    }

    return this.generateJwtUtil.generateJwtToken(user);
  }
}
