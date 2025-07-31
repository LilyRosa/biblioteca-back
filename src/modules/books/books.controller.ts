import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  Request,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BookService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Role, Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { BlobService } from '../blob/blob.service';
@ApiTags('books')
@Controller('books')
export class BookController {
  constructor(
    private readonly bookService: BookService,
    private readonly blobService: BlobService,
  ) {}

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

  @Get(':user/except')
  @ApiOkResponse()
  @ApiOperation({
    summary: 'Obtener todos los libros excepto los del usuario autenticado',
  })
  @Roles(Role.User, Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Invalid Credentials' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  getAllExceptUserBooks(@Request() req) {
    const userId = req.user.userId as number;
    return this.bookService.getAllExceptUserBooks(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un libro' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Crear un nuevo libro con poster y PDF',
    schema: {
      type: 'object',
      properties: {
        theme: { type: 'string' },
        author: { type: 'string' },
        resume: { type: 'string' },
        genre: { type: 'number' },
        poster: {
          type: 'string',
          format: 'binary',
        },
        bookPdf: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'poster', maxCount: 1 },
      { name: 'bookPdf', maxCount: 1 },
    ]),
  )
  async createBook(
    @Body() createBookDto: CreateBookDto,
    @UploadedFiles()
    files: {
      poster?: Express.Multer.File[];
      bookPdf?: Express.Multer.File[];
    },
  ) {
    if (!files.poster || files.poster.length === 0) {
      throw new BadRequestException('El poster es requerido');
    }
    if (!files.bookPdf || files.bookPdf.length === 0) {
      throw new BadRequestException('El PDF del libro es requerido');
    }

    const posterUrl = this.blobService.uploadImage(files.poster[0]);
    const pdfUrl = this.blobService.uploadPdf(files.bookPdf[0]);

    return this.bookService.create({
      ...createBookDto,
      poster: posterUrl,
      bookPdf: pdfUrl,
    });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un libro existente' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Actualizar un libro con poster y/o PDF',
    schema: {
      type: 'object',
      properties: {
        theme: { type: 'string' },
        author: { type: 'string' },
        resume: { type: 'string' },
        genre: { type: 'number' },
        poster: {
          type: 'string',
          format: 'binary',
          nullable: true,
        },
        bookPdf: {
          type: 'string',
          format: 'binary',
          nullable: true,
        },
      },
    },
  })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'poster', maxCount: 1 },
      { name: 'bookPdf', maxCount: 1 },
    ]),
  )
  async updateBook(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookDto: UpdateBookDto,
    @UploadedFiles()
    files: {
      poster?: Express.Multer.File[];
      bookPdf?: Express.Multer.File[];
    },
  ) {
    const updateData: UpdateBookDto & { poster?: string; bookPdf?: string } = {
      ...updateBookDto,
    };

    if (files.poster && files.poster.length > 0) {
      updateData.poster = this.blobService.uploadImage(files.poster[0]);
    }

    if (files.bookPdf && files.bookPdf.length > 0) {
      updateData.bookPdf = this.blobService.uploadPdf(files.bookPdf[0]);
    }

    return this.bookService.update(id, updateData);
  }

  @Delete(':id')
  @ApiOkResponse()
  @ApiOperation({ summary: 'Eliminar un libro' })
  deleteBook(@Param('id', ParseIntPipe) id: number) {
    return this.bookService.remove(id);
  }
}
