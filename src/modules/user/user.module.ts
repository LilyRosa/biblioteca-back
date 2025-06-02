import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import AdminSeederService from './admin-seeder.service';
import AuthModule from '../auth/auth.module';
import { BooksModule } from '../books/books.module';
import { UserBook } from '../user-books/user-books.entity';
import { Book } from '../books/books.entity';
import { UserBooksModule } from '../user-books/user-books.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
    forwardRef(() => BooksModule),
    UserBooksModule,
  ],
  providers: [UserService, AdminSeederService],
  controllers: [UserController],
  exports: [
    TypeOrmModule.forFeature([User, UserBook, Book]),
    AdminSeederService,
  ],
})
export class UserModule {}
