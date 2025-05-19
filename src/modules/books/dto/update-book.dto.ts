import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';
import { CreateBookDto } from './create-book.dto';

export class UpdateBookDto extends PartialType(CreateBookDto) {
  @IsString()
  @ApiProperty()
  theme: string;
  @IsString()
  @ApiProperty()
  author: string;
  @IsString()
  @ApiProperty()
  resume: string;
  @IsString()
  @ApiProperty()
  poster: string;
  @IsString()
  @ApiProperty()
  bookPdf: string;
  @IsNumber()
  @ApiProperty()
  genre: number;
}
