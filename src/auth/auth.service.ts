/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import * as bcryptjs from 'bcryptjs';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { User } from './entities/user.entity';


@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  // Ruta para crear un Usuario
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

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
