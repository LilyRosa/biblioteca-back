import { ApiProperty } from '@nestjs/swagger';

class GenreOutDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  genre: string;
}

export default class BookOutDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  theme: string;

  @ApiProperty()
  author: string;

  @ApiProperty()
  genre: GenreOutDto;

  @ApiProperty()
  resume: string;

  @ApiProperty()
  poster: string;

  @ApiProperty()
  bookPdf: string;
}
