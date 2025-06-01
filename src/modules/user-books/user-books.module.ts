import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserBook } from './user-books.entity'; // Ajusta la ruta si es necesario

@Module({
  imports: [TypeOrmModule.forFeature([UserBook])],
  exports: [TypeOrmModule], // Exporta para que otros módulos puedan inyectar UserBookRepository
})
export class UserBooksModule {}
