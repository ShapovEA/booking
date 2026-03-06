import { BadRequestException, ConflictException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RoomsDocument, RoomsModel } from './rooms.model';
import { Model, MongooseError } from 'mongoose';
import { CreateRoomDto } from './dto/create.room.dto';
import { UpdateRoomDto } from './dto/update.room.dto';

@Injectable()
export class RoomsService {
    constructor(@InjectModel(RoomsModel.name) private readonly roomModel: Model<RoomsModel>) { }

    async create(dto: CreateRoomDto): Promise<RoomsDocument> {
        try {
            return await this.roomModel.create(dto);
        } catch (error) {
            if (error instanceof Error && error.name === 'MongoServerError' && error.message.includes('duplicate')) {
                throw new ConflictException(error.message);
            }

            throw error;
        }
    }

    async update(dto: UpdateRoomDto): Promise<RoomsDocument> {
        const { _id, ...rest } = dto;
        const result = await this.roomModel.findByIdAndUpdate(_id, { ...rest }, { returnDocument: 'after' });

        if (!result) {
            throw new NotFoundException("Room was not found by id provided");
        }

        return result;
    }

    async get(): Promise<RoomsDocument[]> {
        return await this.roomModel.find({});
    }

    async getById(roomId: string | null): Promise<RoomsDocument | null> {
        return await this.roomModel.findById(roomId);
    }

    async deleteById(roomId: string): Promise<RoomsDocument | null> {
        return this.roomModel.findByIdAndDelete(roomId);
    }
}
