import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import RegisterInDto from '../dto/in/register.in.dto';
import UserOutDto from '../dto/out/user.out.dto';
import { Role } from '../../../common/decorators/roles.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export default class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async login(username: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (!user || !(await user.validatePassword(password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      username: user.username,
      userId: user.id_user,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);

    this.logger.log(`Authenticated User ${user.id_user}`);

    return { accessToken };
  }

  async changePassword(
    userId: number,
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id_user: userId },
    });
    if (!user || !(await user.validatePassword(oldPassword))) {
      throw new BadRequestException('Invalid credentials');
    }

    user.password = newPassword;

    await this.userRepository.save(user);

    this.logger.log(`Updated user Password with ID ${user.id_user}`);
  }

  async register(dto: RegisterInDto): Promise<UserOutDto> {
    const existingUserUsername = await this.userRepository.findOne({
      where: { username: dto.username },
    });
    if (existingUserUsername) {
      throw new ConflictException(
        `User with username "${dto.username}" already exists`,
      );
    }

    const newUser = this.userRepository.create({
      username: dto.username,
      email: dto.email,
      password: dto.password,
      role: Role.User,
    });

    await this.userRepository.save(newUser);
    this.logger.log(`Created new user with ID ${newUser.id_user}`);

    return {
      id: newUser.id_user,
      username: newUser.username,
      role: newUser.role,
    };
  }
}
