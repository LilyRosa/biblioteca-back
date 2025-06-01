import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from './user.entity';
import UserMeOutDto from './dto/user.out.dto';
import { Book } from '../books/books.entity';
import { UserBook } from '../user-books/user-books.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserBook)
    private readonly userBookRepository: Repository<UserBook>,
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

    // Eliminar relaciones anteriores
    await this.userBookRepository.delete({ user: { id_user: id } });

    // Crear nuevas relaciones
    const books = await this.bookRepository.find({
      where: { id_book: In(bookIds) },
    });

    const userBooks = books.map((book) => {
      const userBook = new UserBook();
      userBook.user = user;
      userBook.book = book;
      userBook.favorite = false; // o lo que quieras por defecto
      return userBook;
    });

    await this.userBookRepository.save(userBooks);

    // Recargar user con relaciones actualizadas
    return this.getById(id);
  }

  async remove(id: number): Promise<void> {
    const user = await this.getById(id);
    await this.userRepository.remove(user);
  }

  async toggleFavorite(
    userId: number,
    bookId: number,
    favorite: boolean,
  ): Promise<void> {
    const userBook = await this.userBookRepository.findOne({
      where: { user: { id_user: userId }, book: { id_book: bookId } },
    });

    if (!userBook) {
      throw new NotFoundException(`Relación usuario-libro no encontrada`);
    }

    userBook.favorite = favorite;
    await this.userBookRepository.save(userBook);
  }

  async getUserWithBooks(userId: number): Promise<UserMeOutDto> {
    const user = await this.userRepository.findOne({
      where: { id_user: userId },
      relations: ['userBooks', 'userBooks.book', 'userBooks.book.genre'],
    });

    if (!user) {
      throw new NotFoundException(`User ${userId} does not exist.`);
    }

    return {
      id: user.id_user,
      role: user.role,
      username: user.username,
      books: user.userBooks.map((userBook) => {
        const x = userBook.book;
        return {
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
          favorite: userBook.favorite, // si quieres exponer este campo
        };
      }),
    };
  }

  async getUserWithFavoriteBooks(userId: number): Promise<UserMeOutDto> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect(
        'user.userBooks',
        'userBook',
        'userBook.favorite = :favorite',
        { favorite: true },
      )
      .leftJoinAndSelect('userBook.book', 'book')
      .leftJoinAndSelect('book.genre', 'genre')
      .where('user.id_user = :userId', { userId })
      .getOne();

    if (!user) {
      throw new NotFoundException(`User ${userId} does not exist.`);
    }

    return {
      id: user.id_user,
      role: user.role,
      username: user.username,
      books: user.userBooks.map((userBook) => {
        const x = userBook.book;
        return {
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
          favorite: userBook.favorite,
        };
      }),
    };
  }

  async getUserWithSuggestedBooks(userId: number): Promise<UserMeOutDto> {
    // Paso 1: Obtener libros favoritos del usuario
    const userWithFavorites = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect(
        'user.userBooks',
        'userBook',
        'userBook.favorite = :favorite',
        { favorite: true },
      )
      .leftJoinAndSelect('userBook.book', 'favBook')
      .leftJoinAndSelect('favBook.genre', 'favGenre')
      .where('user.id_user = :userId', { userId })
      .getOne();

    if (!userWithFavorites) {
      throw new NotFoundException(`User ${userId} does not exist.`);
    }

    // Extraer IDs de libros favoritos para excluirlos luego
    const favoriteBookIds = userWithFavorites.userBooks.map(
      (ub) => ub.book.id_book,
    );

    // Extraer autores y géneros de libros favoritos
    const favoriteAuthors = userWithFavorites.userBooks.map(
      (ub) => ub.book.author,
    );
    const favoriteGenreIds = userWithFavorites.userBooks.map(
      (ub) => ub.book.genre.id_genre,
    );

    // Paso 2: Buscar libros sugeridos que compartan autor o género, excluyendo favoritos
    const suggestedBooks = await this.bookRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.genre', 'genre')
      .where(
        '(book.author IN (:...authors) OR genre.id_genre IN (:...genreIds))',
        {
          authors: favoriteAuthors.length ? favoriteAuthors : [''],
          genreIds: favoriteGenreIds.length ? favoriteGenreIds : [0],
        },
      )
      .andWhere('book.id_book NOT IN (:...favoriteBookIds)', {
        favoriteBookIds: favoriteBookIds.length ? favoriteBookIds : [0],
      })
      .getMany();

    // Paso 3: Construir el DTO para devolver
    return {
      id: userWithFavorites.id_user,
      role: userWithFavorites.role,
      username: userWithFavorites.username,
      books: suggestedBooks.map((book) => ({
        author: book.author,
        bookPdf: book.bookPdf,
        id: book.id_book,
        poster: book.poster,
        resume: book.resume,
        theme: book.theme,
        genre: {
          id: book.genre.id_genre,
          genre: book.genre.genre,
        },
        favorite: false, // No están en favoritos
      })),
    };
  }
}
