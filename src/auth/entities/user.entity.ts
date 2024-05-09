/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class User {

    _id?: string;

    @Prop({required: true})
    name: string;

    @Prop({required: true})
    lastname: string;

    @Prop({unique: true, required: true})
    username: string;

    @Prop({required: true, minlength:6})
    password?: string;

    @Prop({unique: true, required: true,})
    email: string;

    @Prop({unique: true, required: true})
    phone: string;

    @Prop({unique: true, required: true,})
    ced: string;

    @Prop({default:'user'})
    roles: string;

    @Prop({default: true})
    isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);