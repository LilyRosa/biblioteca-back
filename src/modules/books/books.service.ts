import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './books.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Genre } from '../genre/genre.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
  ) {}

  async getAll(page = 1, limit = 10): Promise<Book[]> {
    return this.bookRepository.find({
      take: limit,
      skip: (page - 1) * limit,
    });
  }

  async getById(id: number): Promise<Book> {
    const book = await this.bookRepository.findOne({
      where: { id_book: id },
      relations: ['genre', 'users'],
    });

    if (!book) {
      throw new NotFoundException(`Libro con id ${id} no encontrado`);
    }

    return book;
  }

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const genre = await this.genreRepository.findOneBy({
      id_genre: createBookDto.genre,
    });

    if (!genre) throw new NotFoundException('Género no encontrado');

    const newBook = this.bookRepository.create({
      ...createBookDto,
      genre,
    });

    return this.bookRepository.save(newBook);
  }

  async update(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.getById(id);
    Object.assign(book, updateBookDto);
    return this.bookRepository.save(book);
  }

  async remove(id: number): Promise<void> {
    const book = await this.getById(id);
    await this.bookRepository.remove(book);
  }
}
