import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from './user.entity';
import UserMeOutDto from './dto/user.out.dto';
import { Book } from '../books/books.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  // async getAll(page = 1, limit = 10): Promise<User[]> {
  //   return this.userRepository.find({
  //     take: limit,
  //     skip: (page - 1) * limit,
  //   });
  // }

  async getById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id_user: id },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }

    return user;
  }

  // async create(createUserDto: CreateUserDto): Promise<User> {
  //   const newUser = this.userRepository.create(createUserDto);
  //   return this.userRepository.save(newUser);
  // }

  // async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
  //   const user = await this.getById(id);
  //   Object.assign(user, updateUserDto);
  //   return this.userRepository.save(user);
  // }

  async updateUserBooks(id: number, bookIds: number[]) {
    const user = await this.getById(id);

    const books = await this.bookRepository.find({
      where: { id_book: In(bookIds) },
    });

    user.books = books;

    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.getById(id);
    await this.userRepository.remove(user);
  }

  async getUserWithBooks(userId: number): Promise<UserMeOutDto> {
    const user = await this.userRepository.findOne({
      where: { id_user: userId },
      relations: ['books', 'books.genre'],
    });

    if (!user) {
      throw new NotFoundException(`User ${userId} does not exist.`);
    }

    return {
      id: user.id_user,
      role: user.role,
      username: user.username,
      books: user.books.map((x) => ({
        author: x.author,
        bookPdf: x.bookPdf,
        id: x.id_book,
        poster: x.poster,
        resume: x.resume,
        theme: x.theme,
        genre: {
          id: x.genre.id_genre,
          genre: x.genre.genre,
        },
      })),
    };
  }
}
