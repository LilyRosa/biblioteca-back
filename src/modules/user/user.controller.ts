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
  Patch,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role, Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserBookFavorite } from './dto/user-book-favorite.dto';
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Get()
  // @ApiOkResponse()
  // @ApiOperation({ summary: 'Obtener todos los usuarios' })
  // getUsers() {
  //   return this.userService.getAll();
  // }

  // @Get(':id')
  // @ApiOkResponse()
  // @ApiOperation({ summary: 'Obtener un usuario dado su id' })
  // getUser(@Param('id', ParseIntPipe) id: number) {
  //   return this.userService.getById(id);
  // }

  @Get('/me')
  @Roles(Role.User, Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Invalid Credentials' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiOkResponse()
  @ApiOperation({ summary: 'Obtener los datos del usuario autenticado' })
  @ApiNotFoundResponse()
  getUserMe(@Request() req) {
    const userId = req.user.userId;

    return this.userService.getUserWithBooks(userId);
  }

  @Get('/me/favorite')
  @Roles(Role.User, Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Invalid Credentials' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiOkResponse()
  @ApiOperation({
    summary: 'Obtener los libros favoritos del usuario autenticado',
  })
  @ApiNotFoundResponse()
  getUserMeFavorite(@Request() req) {
    const userId = req.user.userId;

    return this.userService.getUserWithFavoriteBooks(userId);
  }

  @Get('/me/suggestion')
  @Roles(Role.User, Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Invalid Credentials' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiOkResponse()
  @ApiOperation({
    summary: 'Obtener los libros sugeridos para el usuario autenticado',
  })
  @ApiNotFoundResponse()
  getUserMeSuggestion(@Request() req) {
    const userId = req.user.userId;

    return this.userService.getUserWithSuggestedBooks(userId);
  }

  @Put('/me/books')
  @Roles(Role.User, Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Invalid Credentials' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiOkResponse()
  @ApiOperation({
    summary: 'Actualizar el listado de libros del usuario autenticado',
  })
  @ApiNotFoundResponse()
  putBooksUserMe(@Body() updateUserDto: UpdateUserDto, @Request() req) {
    const userId = req.user.userId;

    return this.userService.updateUserBooks(userId, updateUserDto.books);
  }

  @Delete('/me')
  @Roles(Role.User, Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Invalid Credentials' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiOkResponse()
  @ApiOperation({ summary: 'Eliminar del sistema el usuario autenticado.' })
  @ApiNotFoundResponse()
  deleteUserMe(@Request() req) {
    const userId = req.user.userId;

    return this.userService.remove(userId);
  }

  @Patch('me/books/:bookId/favorite')
  @Roles(Role.User, Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOkResponse()
  @ApiOperation({ summary: 'Añadir libro a favorito' })
  async updateFavorite(
    @Body() favoriteDto: UserBookFavorite,
    @Request() req,
    @Param('bookId', ParseIntPipe) bookId: number,
  ) {
    const userId = req.user.userId;
    await this.userService.toggleFavorite(userId, bookId, favoriteDto.favorite);
    return { message: 'Favorito actualizado' };
  }
}
