import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BookingStatus, ScheduleDocument, ScheduleModel } from './schedule.model';
import { Model, MongooseError, Types } from 'mongoose';
import { CreateScheduleDto } from './dto/create.schedule.dto';
import { PatchScheduleDto } from './dto/patch.schedule.dto';

@Injectable()
export class ScheduleService {
    constructor(@InjectModel(ScheduleModel.name) private readonly scheduleModel: Model<ScheduleModel>) { }

    async create(dto: CreateScheduleDto): Promise<ScheduleDocument> {
        try {
            if (!this.isValidDate(dto.date)) {
                throw new BadRequestException('Date must be in YYYY-MM-DD format')
            }
            return await this.scheduleModel.create({ ...dto, roomId: new Types.ObjectId(dto.roomId), status: BookingStatus.PENDING });
        } catch (error) {
            if (error instanceof MongooseError && error.name === 'ValidationError') {
                throw new BadRequestException(error.message);
            }

            if (error instanceof Error && error.name === 'MongoServerError' && error.message.includes('duplicate')) {
                throw new ConflictException(error.message);
            }

            throw error;
        }
    }

    async getBookings(): Promise<ScheduleDocument[]> {
        return await this.scheduleModel.find({});
    }

    async getByRoomId(roomId: string): Promise<ScheduleDocument[] | null> {
        return this.scheduleModel.find({ roomId });
    }

    async getById(id: string): Promise<ScheduleDocument[] | null> {
        return this.scheduleModel.findById(id);
    }

    async changeStatus(dto: PatchScheduleDto): Promise<ScheduleDocument | null> {
        if (!BookingStatus[dto.status]) {
            throw new BadRequestException(`Invalid status has been provided. There is no as such as ${dto.status} status`)
        }
        return await this.scheduleModel.findByIdAndUpdate(dto._id, { status: dto.status }, { new: true });
    }

    async deleteById(id: string): Promise<ScheduleDocument | null> {
        return await this.scheduleModel.findByIdAndDelete(id);
    }

    async getReportByMonth(monthNumber: number) {
        const dateFrom = new Date(Date.UTC(new Date().getFullYear(), monthNumber - 1, 1));
        const from = dateFrom.toISOString().split('T')[0];

        const dateTo = new Date(Date.UTC(new Date().getFullYear(), monthNumber, 1));
        const to = dateTo.toISOString().split('T')[0];

        return await this.scheduleModel.aggregate([
            {
                $match: {
                    date: {
                        $gte: from,
                        $lt: to
                    }
                }
            },
            {
                $lookup: {
                    from: "rooms",
                    localField: "roomId",
                    foreignField: "_id",
                    as: "rooms"
                }
            },
            {
                $group: {
                    _id: {
                        roomId: "roomId",
                        number: {
                            $arrayElemAt: ["$rooms.number", 0]
                        }
                    },
                    count: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: { count: -1 }
            },
            {
                $group: {
                    _id: null,
                    data: {
                        $push: {
                            k: {
                                $concat: [
                                    "Room ",
                                    { $toString: "$_id.number" }
                                ]
                            },
                            v: "$count"
                        }
                    }
                }
            },
            {
                $replaceRoot: {
                    newRoot: { $arrayToObject: "$data" }
                }
            }
        ]).exec();
    }

    private isValidDate(date: string): boolean {
        return /^\d{4}-\d{2}-\d{2}$/.test(date) && !isNaN(new Date(date).getTime());
    }
}