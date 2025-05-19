import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Book } from '../books/books.entity';

@Entity()
export class Genre {
  @PrimaryGeneratedColumn()
  id_genre: number;

  @Column()
  genre: string;

  @OneToMany(() => Book, (book) => book.genre)
  books: Book[];
}
