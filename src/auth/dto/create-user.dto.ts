/* eslint-disable prettier/prettier */

import { IsEmail, IsPhoneNumber, IsString, Length, MaxLength } from "class-validator";

export class CreateUserDto {

    @IsString()
    name: string;
    
    @IsString()
    lastname: string;

    @IsString()
    username: string;

    @MaxLength(6)
    password: string;

    @IsEmail()
    email: string;

    @IsPhoneNumber('EC')
    phone: string;

    @Length( 10, 10)
    ced: string;
}
