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
import { GenreService } from './genre.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
@ApiTags('genres')
@Controller('genres')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Get()
  @ApiOkResponse()
  @ApiOperation({ summary: 'Obtener todos los géneros' })
  getGenres() {
    return this.genreService.getAll();
  }

  @Get(':id')
  @ApiOkResponse()
  @ApiOperation({ summary: 'Obtener un género dado su id' })
  getGenre(@Param('id', ParseIntPipe) id: number) {
    return this.genreService.getById(id);
  }

  @Post()
  @ApiOkResponse()
  @ApiOperation({ summary: 'Crear un género' })
  createGenre(@Body() createGenreDto: CreateGenreDto) {
    return this.genreService.create(createGenreDto);
  }

  @Put(':id')
  @ApiOkResponse()
  @ApiOperation({ summary: 'Actualizar un género existente' })
  updateGenre(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGenreDto: UpdateGenreDto,
  ) {
    return this.genreService.update(id, updateGenreDto);
  }

  @Delete(':id')
  @ApiOkResponse()
  @ApiOperation({ summary: 'Eliminar un género' })
  deleteGenre(@Param('id', ParseIntPipe) id: number) {
    return this.genreService.remove(id);
  }
}
