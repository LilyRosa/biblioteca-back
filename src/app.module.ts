import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { BooksModule } from './modules/books/books.module';
import { GenreModule } from './modules/genre/genre.module';
import { UserModule } from './modules/user/user.module';
import { UserBooksModule } from './modules/user-books/user-books.module';
import AuthModule from './modules/auth/auth.module';
import { MailModule } from './modules/mail/mail.module';
import { BlobModule } from './modules/blob/blob.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    BooksModule,
    GenreModule,
    UserModule,
    AuthModule,
    UserBooksModule,
    MailModule,
    BlobModule,
  ],
})
export class AppModule {
  static port: number;
  constructor(private readonly configService: ConfigService) {
    AppModule.port = +this.configService.get('PORT');
  }
}
