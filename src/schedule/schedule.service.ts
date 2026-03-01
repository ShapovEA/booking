import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BookingStatus, ScheduleDocument, ScheduleModel } from './schedule.model';
import { Model, Types } from 'mongoose';
import { CreateScheduleDto } from './dto/create.schedule.dto';
import { PatchScheduleDto } from './dto/patch.schedule.dto';

@Injectable()
export class ScheduleService {
    constructor(@InjectModel(ScheduleModel.name) private readonly scheduleModel: Model<ScheduleModel>) { }

    async create(dto: CreateScheduleDto): Promise<ScheduleDocument> {
        if (!this.isValidDate(dto.date)) {
            throw new BadRequestException('Date must be in YYYY-MM-DD format')
        }
        return await this.scheduleModel.create({ ...dto, status: BookingStatus.PENDING });
    }

    async getBookings(): Promise<ScheduleDocument[]> {
        return await this.scheduleModel.find({});
    }

    async getByRoomId(roomId: string): Promise<ScheduleDocument[] | null> {
        return this.scheduleModel.find({ roomId });
    }

    async changeStatus(dto: PatchScheduleDto): Promise<ScheduleDocument | null> {
        if (!BookingStatus[dto.status]) {
            throw new BadRequestException(`Invalid status has been provided. There is no as such as ${dto.status} status`)
        }
        return await this.scheduleModel.findByIdAndUpdate(dto.roomId, { status: dto.status });
    }

    async deleteById(id: string): Promise<ScheduleDocument | null> {
        return await this.scheduleModel.findByIdAndDelete(id);
    }

    private isValidDate(date: string): boolean {
        return /^\d{4}-\d{2}-\d{2}$/.test(date) && !isNaN(new Date(date).getTime());
    }
}