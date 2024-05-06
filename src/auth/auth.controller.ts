/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';

import { CreateUserDto, LoginDto, UpdateUserDto, RegisterUserDto } from './dto';
import { AuthGuard } from './guards/auth.guard';
import { User } from './entities/user.entity';
import { LoginResponse } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Ruta para crear un usuario
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  // EndPoint para login
  @Post('/login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  //EndPoint para registro
  @Post('/register')
  register(@Body() registerDto: RegisterUserDto){
    return this.authService.register(registerDto);
  }

  //EndPoint para hacer un check del token
  @UseGuards(AuthGuard)
  @Get('/check-token')
  checkToken( @Request() req: Request): LoginResponse{
    
    const user = req['user'] as User;

    return {
      user,
      token: this.authService.getJwtToken({id: user._id})
    }

  }

  //EndPoint para obtener todos los usuarios
  @UseGuards(AuthGuard)
  @Get()
  findAll( @Request() req: Request ) {
    // const user = req['user']
    // return user;
    return this.authService.findAll();
  }

  //EndPoint para obtener todos los usuarios que tienen rol user
  @UseGuards(AuthGuard)
  @Get('/users')
  findAllUsers(@Request() req: Request) {
    return this.authService.finAllUsers();
  }

  //EndPoint para oobtener todos los usuarios que tienen rol admin
  @UseGuards(AuthGuard)
  @Get('/admins')
  findAllAdmins(@Request() req: Request){
    return this.authService.finAllAdmins();
  }

  //EndPoint para obtener un usuario por id
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findUserByID(id);
  }

  //EndPoint para actualizar un usuario
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.update(id, updateUserDto);
  }

  //EndPoint para eliminar un usuario
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
