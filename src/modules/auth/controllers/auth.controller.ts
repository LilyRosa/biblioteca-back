import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import AuthService from '../services/auth.service';
import { AuthOutDto } from '../dto/out/auth.out.dto';
import LoginInDto from '../dto/in/login.in.dto';
import ChangePasswordInDto from '../dto/in/change-password.in.dto';
import RegisterInDto from '../dto/in/register.in.dto';
import UserOutDto from '../dto/out/user.out.dto';
import { Role, Roles } from '../../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';

@Controller('auth')
@ApiTags('auth')
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiCreatedResponse({ description: 'Login Successful', type: AuthOutDto })
  @ApiForbiddenResponse({ description: 'Invalid Credentials' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiOperation({ summary: 'Authenticate into System' })
  async login(@Body() body: LoginInDto): Promise<AuthOutDto> {
    const { accessToken } = await this.authService.login(
      body.username,
      body.password,
    );
    return {
      accessToken: accessToken,
    };
  }

  @Post('register')
  @ApiCreatedResponse({
    description: 'Register Customer Successful',
    type: UserOutDto,
  })
  @ApiConflictResponse({
    description: 'Conflict with Username or Email',
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiOperation({ summary: 'Register User' })
  async register(@Body() dto: RegisterInDto): Promise<UserOutDto> {
    return this.authService.register(dto);
  }

  @Post('change-password')
  @Roles(Role.User, Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Invalid Credentials' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiCreatedResponse({ description: 'Password changed successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiOperation({ summary: 'Change current user password' })
  async changePassword(@Body() dto: ChangePasswordInDto, @Request() req) {
    const userId = req.user.userId;
    return this.authService.changePassword(
      userId,
      dto.oldPassword,
      dto.newPassword,
    );
  }
}
