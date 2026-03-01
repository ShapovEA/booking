import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create.room.dto';
import { UpdateRoomDto } from './dto/update.room.dto';
import { RoomsDocument } from './rooms.model';

@Controller('rooms')
export class RoomsController {
    constructor(private roomsService: RoomsService) { }

    @Get()
    async getRooms(): Promise<RoomsDocument[]> {
        return await this.roomsService.get();
    }

    @Get('byId/:roomId')
    async getRoomById(@Param('roomId') roomId: string): Promise<RoomsDocument | null> {
        return await this.roomsService.getById(roomId);
    }

    @Post()
    async createRoom(@Body() dto: CreateRoomDto): Promise<RoomsDocument> {
        return await this.roomsService.create(dto);
    }

    @Patch()
    async updateRoom(@Body() dto: UpdateRoomDto): Promise<RoomsDocument | null> {
        return this.roomsService.update(dto);
    }

    @Delete('byId/:roomId')
    async deleteRoomById(@Param('roomId') roomId: string): Promise<RoomsDocument | null> {
        return await this.roomsService.deleteById(roomId);
    }
}
