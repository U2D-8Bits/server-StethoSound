/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';

import { CreateUserDto, LoginDto, UpdateAuthDto, RegisterUserDto } from './dto';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Ruta para crear un usuario
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  // Ruta para login
  @Post('/login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  //Ruta para registro
  @Post('/register')
  register(@Body() registerDto: RegisterUserDto){
    return this.authService.register(registerDto);
  }

  //Ruta para obtener todos los usuarios
  @UseGuards(AuthGuard)
  @Get()
  findAll( @Request() req: Request ) {
    // const user = req['user']
    // return user;
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
