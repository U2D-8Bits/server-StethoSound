/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import * as bcryptjs from 'bcryptjs';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { User } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';


@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  // --------------------------- Ruta para crear un Usuario --------------------------- //
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {

      // Extraer la contrasena del objeto createUserDto
      const {password, ...userData} = createUserDto;

      // Encriptar la contrasena
      const newUser = new this.userModel({
        password: bcryptjs.hashSync(password, 10),
        ...userData,
      });

      // Guardar el usuario en la base de datos
      await newUser.save();
      const { password:_, ...user} = newUser.toJSON();

      return user;

    } catch (error) {
      console.log(error.code);
      if (error.code === 11000) {
        throw new BadRequestException(
          `${createUserDto.email} ya existe en la base de datos`,
        );
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  // --------------------------- Login --------------------------- //
  async login( loginDto: LoginDto){

    // Desestructurar el objeto loginDto para obtener el username y password
    const { username, password} = loginDto;

    // Buscar el usuario en la base de datos
    const user = await this.userModel.findOne({username});

    // Verificar si el usuario existe
    if(!user){
      throw new UnauthorizedException('Credenciales invalidas - username');
    }

    // Verificar si la contrasena es correcta
    if(!bcryptjs.compareSync(password, user.password)){
      throw new UnauthorizedException('Credenciales invalidas - password');
    }

    // Desestructurar la contrasena del usuario y retornar el usuario
    const { password:_, ...rest } = user.toJSON();

    // Retornamos la informacion del usuario y un token
    return {
      user: rest,
      token: 'ABC-123'
    }

  }


  // --------------------------- Rutas para obtener todos los usuarios --------------------------- //
  findAll() {
    return `This action returns all auth`;
  }

  // --------------------------- Rutas para obtener un usuario --------------------------- //
  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  // --------------------------- Rutas para actualizar un usuario --------------------------- //
  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  // --------------------------- Rutas para eliminar un usuario --------------------------- //
  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
