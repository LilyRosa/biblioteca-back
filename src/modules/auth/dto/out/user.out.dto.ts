import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../../common/decorators/roles.decorator';

export default class UserOutDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  role: Role;
}
