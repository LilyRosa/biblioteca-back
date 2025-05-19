import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BookService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
@ApiTags('books')
@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  @ApiOkResponse()
  @ApiOperation({ summary: 'Obtener todos los libros' })
  getBooks() {
    return this.bookService.getAll();
  }

  @Get(':id')
  @ApiOkResponse()
  @ApiOperation({ summary: 'Obtener un libro dado su id' })
  getBook(@Param('id', ParseIntPipe) id: number) {
    return this.bookService.getById(id);
  }

  @Post()
  @ApiOkResponse()
  @ApiOperation({ summary: 'Crear un libro' })
  createBook(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }

  @Put(':id')
  @ApiOkResponse()
  @ApiOperation({ summary: 'Actualizar un libro existente' })
  updateBook(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    return this.bookService.update(id, updateBookDto);
  }

  @Delete(':id')
  @ApiOkResponse()
  @ApiOperation({ summary: 'Eliminar un libro' })
  deleteBook(@Param('id', ParseIntPipe) id: number) {
    return this.bookService.remove(id);
  }
}
