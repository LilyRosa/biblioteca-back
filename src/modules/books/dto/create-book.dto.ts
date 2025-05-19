import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  theme: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  author: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  resume: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  poster: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  bookPdf: string;
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  genre: number;
}
