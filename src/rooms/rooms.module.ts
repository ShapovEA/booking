import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomsModel, RoomsSchema } from './rooms.model';

@Module({
  controllers: [RoomsController],
  providers: [RoomsService],
  imports: [MongooseModule.forFeature([{ name: RoomsModel.name, schema: RoomsSchema }])]
})
export class RoomsModule { }
