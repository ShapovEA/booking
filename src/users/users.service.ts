import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument, UserModel, UserRole } from './user.model';
import { Model } from 'mongoose';
import { CreateUserDTO } from './dto/create.user.dto';
import { UpdateUserDTO } from './dto/update.user.dto';
import { ERRORS } from 'src/constants/errors';
import { UpdateUserByAdminDTO } from './dto/update.user.admin.dto';
import { genSalt, hash } from 'bcryptjs';

@Injectable()
export class UsersService {
    constructor(@InjectModel(UserModel.name) private readonly userModel: Model<UserModel>) { }

    async getUsers(): Promise<UserDocument[]> {
        return await this.userModel.find({}).exec();
    }

    async getUser(id: string): Promise<UserDocument> {
        const result = await this.userModel.findById(id).exec();

        if (!result) {
            throw new NotFoundException(ERRORS.USER_NOT_FOUND_BY_ID);
        }

        return result;
    }

    async createUser(dto: CreateUserDTO): Promise<UserDocument> {
        try {
            const salt = await genSalt(10);
            const passwordHash = await hash(dto.password, salt);
            return await this.userModel.create({
                email: dto.email,
                firstName: dto.firstName,
                middleName: dto?.middleName,
                lastName: dto?.lastName,
                passwordHash,
                phoneNumber: dto.phoneNumber,
                roles: dto.roles
            });
        } catch (error) {
            this.handleDuplicateError(error);
            throw error;
        }
    }

    async updateUser(id: string, dto: UpdateUserDTO): Promise<UserDocument> {
        const updated = await this.userModel.findByIdAndUpdate(id, { ...dto }, { returnDocument: 'after' })
            .exec();

        if (!updated) {
            throw new NotFoundException(ERRORS.USER_NOT_FOUND_BY_ID);
        };

        return updated;
    }

    async updateUserByAdmin(id: string, dto: UpdateUserByAdminDTO,): Promise<UserDocument> {
        const updated = await this.userModel.findByIdAndUpdate(id, { ...dto }, { returnDocument: 'after' })
            .exec();

        if (!updated) {
            throw new NotFoundException(ERRORS.USER_NOT_FOUND_BY_ID);
        };

        return updated;
    }

    async deleteUser(id: string): Promise<UserDocument> {
        const deleted = await this.userModel.findByIdAndDelete(id).exec();

        if (!deleted) {
            throw new NotFoundException(ERRORS.USER_NOT_FOUND_BY_ID);
        };

        return deleted;
    }

    private handleDuplicateError(error: any) {
        if (error instanceof Error && error.name === 'MongoServerError' && error.message.includes('duplicate')) {
            throw new ConflictException(error.message)
        }
    }
}
