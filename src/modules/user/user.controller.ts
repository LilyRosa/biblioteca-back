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

  // @Post()
  // @ApiOkResponse()
  // @ApiOperation({ summary: 'Crear un usuario' })
  // createUser(@Body() createUserDto: CreateUserDto) {
  //   return this.userService.create(createUserDto);
  // }

  // @Put(':id')
  // @ApiOkResponse()
  // @ApiOperation({ summary: 'Actualizar un usuario existente' })
  // updateUser(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() updateUserDto: UpdateUserDto,
  // ) {
  //   return this.userService.update(id, updateUserDto);
  // }

  // @Delete(':id')
  // @ApiOkResponse()
  // @ApiOperation({ summary: 'Eliminar un usuario' })
  // deleteUser(@Param('id', ParseIntPipe) id: number) {
  //   return this.userService.remove(id);
  // }
}
