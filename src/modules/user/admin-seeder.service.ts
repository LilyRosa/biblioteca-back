import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { Role } from 'src/common/decorators/roles.decorator';

@Injectable()
export default class AdminSeederService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async createAdminUser(): Promise<void> {
    const adminUsername = this.configService.get<string>(
      'SEED_ADMIN_USERNAME',
    )!;
    const adminPassword = this.configService.get<string>(
      'SEED_ADMIN_PASSWORD',
    )!;

    const existingUser = await this.userRepository.findOne({
      where: { username: adminUsername },
    });

    if (!existingUser) {
      const adminUser = this.userRepository.create({
        username: adminUsername,
        password: adminPassword,
        role: Role.Admin,
      });

      await this.userRepository.save(adminUser);
      console.log('Admin User Created:', adminUsername);
    }
  }
}
