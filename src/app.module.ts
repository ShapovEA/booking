import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from './schedule/schedule.module';
import { RoomsModule } from './rooms/rooms.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { getDBConfig } from './configs/db.config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { TelegramModule } from './telegram/telegram.module';
import { getTelegramConfig } from './configs/telegram.config';
import { RoomsService } from './rooms/rooms.service';
import { UsersService } from './users/users.service';

@Module({
  imports: [
    ScheduleModule,
    RoomsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : `.env`
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getDBConfig
    }),
    UsersModule,
    AuthModule,
    FilesModule,
    TelegramModule.forRootAsync({
      useFactory: getTelegramConfig,
      imports: [ConfigModule, RoomsModule, UsersModule],
      inject: [ConfigService, RoomsService, UsersService]
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
