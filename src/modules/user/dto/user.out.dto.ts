import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/common/decorators/roles.decorator';
import BookOutDto from 'src/modules/books/dto/book.out.dto';

export default class UserMeOutDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  role: Role;

  @ApiProperty()
  username: string;

  @ApiProperty()
  books: BookOutDto[];
}
