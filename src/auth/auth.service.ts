/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { BadRequestException, HttpException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

import * as bcryptjs from 'bcryptjs';


import { User } from './entities/user.entity';
import { RegisterUserDto, CreateUserDto, UpdateUserDto, LoginDto } from './dto';
import { JwtPayload, LoginResponse} from './interfaces';

import mongoose from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  // Todo: CheckIdObject
  async checkIdObject(id: string): Promise<boolean>  {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if(!isValid) throw new HttpException('Usuario no ecnontrado', 404);
    const user = await this.userModel.findById(id);
    if(!user) throw new HttpException('Usuario no ecnontrado', 404);

    return true;
  }
  
  // Todo: Ruta para crear un Usuario
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      // Extraer la contrasena del objeto createUserDto
      const { password, ...userData } = createUserDto;

      // Encriptar la contrasena
      const newUser = new this.userModel({
        password: bcryptjs.hashSync(password, 10),
        ...userData,
      });

      // Guardar el usuario en la base de datos
      await newUser.save();
      const { password: _, ...user } = newUser.toJSON();

      return user;
    } catch (error) {
      console.log({error});
      console.log(error.code);
      console.log(error.message);
      if (error.code === 11000) {
        if( error.keyValue.username) throw new BadRequestException('El nombre de usuario ya esta en uso');
        if( error.keyValue.email) throw new BadRequestException('El correo ya esta en uso');
        if( error.keyValue.phone) throw new BadRequestException('El telefono ya esta en uso');
        if( error.keyValue.ced) throw new BadRequestException('La cedula ya esta en uso');
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  // --------------------------- Rutas para registrarse --------------------------- //
  async register(registerDto: RegisterUserDto): Promise<LoginResponse> {
    const user = await this.create({
      name: registerDto.name,
      lastname: registerDto.lastname,
      email: registerDto.email,
      password: registerDto.password,
      username: registerDto.username,
      phone: registerDto.phone,
      ced: registerDto.ced,
      roles: ['user'],
    });

    console.log("Usuario Registrado =>", user)

    return {
      user: user,
      token: this.getJwtToken({ id: user._id }),
    };
  }

  // --------------------------- Login --------------------------- //
  async login(loginDto: LoginDto): Promise<LoginResponse> {
    // Desestructurar el objeto loginDto para obtener el username y password
    const { username, password } = loginDto;

    // Buscar el usuario en la base de datos
    const user = await this.userModel.findOne({ username });

    // Verificar si el usuario existe
    if (!user) {
      throw new UnauthorizedException('Usuario o Contraseña invalidos');
    }

    // Verificar si la contrasena es correcta
    if (!bcryptjs.compareSync(password, user.password)) {
      throw new UnauthorizedException('Usuario o Contraseña invalidos');
    }

    // Desestructurar la contrasena del usuario y retornar el usuario
    const { password: _, ...rest } = user.toJSON();

    // Retornamos la informacion del usuario y un token
    return {
      user: rest,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  // --------------------------- Rutas para obtener todos los usuarios --------------------------- //
  findAll(): Promise <User[]> {
    return this.userModel.find();
  }

  // --------------------------- Rutas para obtener todos los usuarios que tienen rol user --------------------------- //

  finAllUsers(): Promise<User[]>{
    return this.userModel.find({roles: 'user'});
  }

  // --------------------------- Rutas para obtener todos los usuarios que tienen rol admin --------------------------- //
  finAllAdmins(): Promise<User[]>{
    return this.userModel.find({roles: 'admin'});
  }

  // -------------------------------- Find User By ID -------------------------------- //
  async findUserByID(userId: string){
    const isValid = mongoose.Types.ObjectId.isValid(userId);
    if(!isValid) throw new HttpException('Usuario no ecnontrado', 404);
    const user = await this.userModel.findById(userId); 
    if(!user) throw new HttpException('Usuario no ecnontrado', 404);

    const { password, ...rest} = user.toJSON(); 
    return rest;
  }

  // --------------------------- Rutas para obtener un usuario --------------------------- //
  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  // --------------------------- Rutas para actualizar un usuario --------------------------- //
  async update(id: string, updateuserDto: UpdateUserDto) {

    const isValid = mongoose.Types.ObjectId.isValid(id);
    if(!isValid) throw new HttpException('Usuario no ecnontrado', 404);

    const user = await this.userModel.findById(id);
    if(!user) throw new HttpException('Usuario no ecnontrado', 404);

    user.set(updateuserDto);
  }

  // --------------------------- Rutas para eliminar un usuario --------------------------- //
  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  // --------------------------- Rutas para obtener el JWT --------------------------- //
  getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
