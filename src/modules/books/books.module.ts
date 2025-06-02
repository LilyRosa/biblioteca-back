import { forwardRef, Module } from '@nestjs/common';
import { BookService } from './books.service';
import { BookController } from './books.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './books.entity';
import { Genre } from '../genre/genre.entity';
import { UserBook } from '../user-books/user-books.entity';
import AuthModule from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book, Genre, UserBook]),
    forwardRef(() => AuthModule),
  ],
  providers: [BookService],
  controllers: [BookController],
  exports: [TypeOrmModule.forFeature([Book, Genre])],
})
export class BooksModule {}
