import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Genre } from '../genre/genre.entity';
import { UserBook } from '../user-books/user-books.entity'; // Asegúrate que la ruta sea correcta

@Entity()
export class Book {
  @PrimaryGeneratedColumn('increment')
  id_book: number;

  @Column()
  theme: string;

  @Column()
  author: string;

  @Column()
  resume: string;

  @ManyToOne(() => Genre, (genre) => genre.books, { eager: true })
  @JoinColumn({ name: 'genre_id' })
  genre: Genre;

  @Column()
  poster: string;

  @Column()
  bookPdf: string;

  // Reemplaza ManyToMany por OneToMany hacia UserBook
  @OneToMany(() => UserBook, (userBook) => userBook.book)
  userBooks: UserBook[];
}
