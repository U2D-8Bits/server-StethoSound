/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
// Importaciones de nestJS
import { ConfigModule } from '@nestjs/config';
// Importaciones de 3ros
import { MongooseModule } from '@nestjs/mongoose';
// Importaciones propias
import { AuthModule } from './auth/auth.module';




@Module({
  imports: [
    // Modulos de nestJS
    ConfigModule.forRoot(),

    // Modulos de 3eros
    MongooseModule.forRoot(process.env.MONGO_URI),

    // Modulos propios
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {

}
