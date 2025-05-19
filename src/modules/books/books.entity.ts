import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { Genre } from '../genre/genre.entity';
import { User } from '../user/user.entity';

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

  @ManyToMany(() => User, (user) => user.books)
  users: User[];
}
