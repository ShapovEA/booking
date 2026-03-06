import { Body, Controller, Delete, Get, Param, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create.schedule.dto';
import { ScheduleDocument } from './schedule.model';
import { PatchScheduleDto } from './dto/patch.schedule.dto';

@Controller('schedule')
export class ScheduleController {
    constructor(private scheduleService: ScheduleService) { }

    @UsePipes(new ValidationPipe())
    @Post()
    async create(@Body() dto: CreateScheduleDto): Promise<ScheduleDocument> {
        return this.scheduleService.create(dto);
    }

    @Get()
    async getBookings() {
        return this.scheduleService.getBookings()
    }

    @Get('byId/:id')
    async getById(@Param('id') id: string) {
        return await this.scheduleService.getById(id);
    }

    @Get('byRoomId/:roomId')
    async getByRoomId(@Param('roomId') roomId: string): Promise<ScheduleDocument[] | null> {
        return this.scheduleService.getByRoomId(roomId);
    }

    @UsePipes(new ValidationPipe())
    @Patch()
    async changeStatus(@Body() dto: PatchScheduleDto): Promise<ScheduleDocument | null> {
        return this.scheduleService.changeStatus(dto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<ScheduleDocument | null> {
        return this.scheduleService.deleteById(id);
    }
}
