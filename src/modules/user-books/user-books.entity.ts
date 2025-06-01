// user-book.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Book } from '../books/books.entity';

@Entity()
export class UserBook {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  favorite: boolean; // Campo adicional

  // Relación ManyToOne hacia User (obligatoria)
  @ManyToOne(() => User, (user) => user.userBooks)
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Relación ManyToOne hacia Book
  @ManyToOne(() => Book, (book) => book.userBooks)
  @JoinColumn({ name: 'book_id' })
  book: Book;
}
