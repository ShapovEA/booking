import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create.schedule.dto';
import { ScheduleDocument } from './schedule.model';
import { PatchScheduleDto } from './dto/patch.schedule.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/user.model';

@Controller('schedule')
export class ScheduleController {
    constructor(private scheduleService: ScheduleService) { }

    @Roles(UserRole.user, UserRole.admin)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    async create(@Body() dto: CreateScheduleDto): Promise<ScheduleDocument> {
        return this.scheduleService.create(dto);
    }

    @Roles(UserRole.admin)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    async getBookings() {
        return this.scheduleService.getBookings()
    }

    @Roles(UserRole.admin)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('byId/:id')
    async getById(@Param('id') id: string) {
        return await this.scheduleService.getById(id);
    }

    @Roles(UserRole.admin)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('byRoomId/:roomId')
    async getByRoomId(@Param('roomId') roomId: string): Promise<ScheduleDocument[] | null> {
        return this.scheduleService.getByRoomId(roomId);
    }

    @Roles(UserRole.admin, UserRole.user)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Patch()
    async changeStatus(@Body() dto: PatchScheduleDto): Promise<ScheduleDocument | null> {
        return this.scheduleService.changeStatus(dto);
    }

    @Roles(UserRole.admin)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    async delete(@Param('id') id: string): Promise<ScheduleDocument | null> {
        return this.scheduleService.deleteById(id);
    }
}
