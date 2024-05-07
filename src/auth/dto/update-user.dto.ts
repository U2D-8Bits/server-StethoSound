/* eslint-disable prettier/prettier */

import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    
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

    @IsString()
    roles: string[];
}
