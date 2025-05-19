import { Module } from '@nestjs/common';
import { BookService } from './books.service';
import { BookController } from './books.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './books.entity';
import { Genre } from '../genre/genre.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Book, Genre])],
  providers: [BookService],
  controllers: [BookController],
  exports: [TypeOrmModule.forFeature([Book, Genre])],
})
export class BooksModule {}
