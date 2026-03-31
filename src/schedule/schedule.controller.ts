import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create.schedule.dto';
import { ScheduleDocument } from './schedule.model';
import { PatchScheduleDto } from './dto/patch.schedule.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/user.model';
import { TelegramService } from 'src/telegram/telegram.service';
import { UserId } from 'src/users/decorators/userId.decorator';

@Controller('schedule')
export class ScheduleController {
    constructor(
        private readonly scheduleService: ScheduleService,
        private readonly telegramService: TelegramService
    ) { }

    @Roles(UserRole.user, UserRole.admin)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    async create(@Body() dto: CreateScheduleDto, @UserId() userId: string): Promise<ScheduleDocument> {
        const res = await this.scheduleService.create(dto);
        await this.telegramService.notifyScheduleChange(userId, res.roomId.toString(), res.status);
        return res;
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
    async changeStatus(@Body() dto: PatchScheduleDto, @UserId() userId: string): Promise<ScheduleDocument | null> {
        const res = await this.scheduleService.changeStatus(dto);
        if (res) {
            await this.telegramService.notifyScheduleChange(userId, res.roomId.toString(), res.status);
        }

        return res;
    }

    @Roles(UserRole.admin)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    async delete(@Param('id') id: string): Promise<ScheduleDocument | null> {
        return this.scheduleService.deleteById(id);
    }

    @Roles(UserRole.admin)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('report/byMonth')
    async getReportByMonth(@Query('month') month: number) {
        if (!month) {
            throw new BadRequestException("The month param is required");
        }
        return await this.scheduleService.getReportByMonth(month);
    }
}
