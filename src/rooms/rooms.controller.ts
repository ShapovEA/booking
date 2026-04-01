import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create.room.dto';
import { UpdateRoomDto } from './dto/update.room.dto';
import { RoomsDocument } from './rooms.model';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/user.model';
import { TelegramService } from 'src/telegram/telegram.service';

@Controller('rooms')
export class RoomsController {
    constructor(
        private readonly roomsService: RoomsService
    ) { }

    @Get()
    async getRooms(): Promise<RoomsDocument[]> {
        return await this.roomsService.get();
    }

    @Get('byId/:roomId')
    async getRoomById(@Param('roomId') roomId: string): Promise<RoomsDocument | null> {
        return await this.roomsService.getById(roomId);
    }

    @Roles(UserRole.admin)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    async createRoom(@Body() dto: CreateRoomDto): Promise<RoomsDocument> {
        return await this.roomsService.create(dto);
    }

    @Roles(UserRole.admin)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Patch()
    async updateRoom(@Body() dto: UpdateRoomDto): Promise<RoomsDocument | null> {
        return this.roomsService.update(dto);
    }

    @Roles(UserRole.admin)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete('byId/:roomId')
    async deleteRoomById(@Param('roomId') roomId: string): Promise<RoomsDocument | null> {
        return await this.roomsService.deleteById(roomId);
    }
}
