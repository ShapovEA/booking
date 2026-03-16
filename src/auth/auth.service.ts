import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument, UserModel, UserRole } from 'src/users/user.model';
import { RegisterAuthDTO } from './dto/register.auth.dto';
import { compare, genSalt, hash } from 'bcryptjs';
import { LoginAuthDTO } from './dto/login.auth.dto';
import { ERRORS } from 'src/constants/errors';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/constants/types';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(UserModel.name) private readonly userModel: Model<UserModel>,
        private readonly jwtService: JwtService
    ) { }
    async register(dto: RegisterAuthDTO): Promise<UserDocument> {
        try {
            const salt = await genSalt(10);
            return await this.userModel.create({
                ...dto,
                passwordHash: await hash(dto.password, salt),
                roles: [UserRole.user]
            });
        } catch (error) {
            this.handleDuplicateError(error);
            throw error;
        }
    }

    async validate(dto: LoginAuthDTO): Promise<JwtPayload> {
        const user = await this.userModel.findOne({ email: dto.email });
        if (!user) {
            throw new UnauthorizedException(ERRORS.LOGIN_ATTEMPT_FAILED);
        };

        const isCorrectPassword = await compare(dto.password, user.passwordHash);
        if (!isCorrectPassword) {
            throw new UnauthorizedException(ERRORS.LOGIN_ATTEMPT_FAILED);
        }
        return { id: user.id, email: user.email, roles: user.roles }
    }

    async login(user: JwtPayload): Promise<{ access_token: string }> {
        const payload = { id: user.id, email: user.email, roles: user.roles };
        return {
            access_token: await this.jwtService.signAsync(payload)
        }
    }

    private handleDuplicateError(error: any) {
        if (error instanceof Error && error.name === 'MongoServerError' && error.message.includes('duplicate')) {
            throw new ConflictException(error.message);
        }
    }
}
