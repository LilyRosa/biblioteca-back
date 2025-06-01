import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UserBookFavorite {
  @ApiProperty()
  @IsBoolean()
  favorite: boolean;
}
