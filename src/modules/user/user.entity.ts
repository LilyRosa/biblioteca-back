import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Book } from '../books/books.entity';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/common/decorators/roles.decorator';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id_user: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
  })
  role: Role;

  @Column({ nullable: true })
  email?: string;

  @ManyToMany(() => Book, (book) => book.users, { eager: true }) // carga automática opcional
  @JoinTable({
    name: 'user_books', // nombre de la tabla intermedia (opcional)
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id_user',
    },
    inverseJoinColumn: {
      name: 'book_id',
      referencedColumnName: 'id_book',
    },
  })
  books: Book[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compareSync(password, this.password);
  }
}
