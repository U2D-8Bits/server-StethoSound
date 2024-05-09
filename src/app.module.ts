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

    // Modo de Produccion
    // MongooseModule.forRoot(process.env.MONGO_PROD,{
    //   dbName: process.env.MONGO_BD_NAME
    // }),

    // Modo de desarrollo
    MongooseModule.forRoot(process.env.MONGO_ATLAS),

    // Modulos propios
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {

}
