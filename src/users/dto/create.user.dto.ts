import { IsArray, IsEnum, IsOptional, IsString } from "class-validator";
import { UserRole } from "../user.model";

export class CreateUserDTO {
    @IsString()
    email: string;

    @IsString()
    password: string;

    @IsString()
    firstName: string;

    @IsString()
    @IsOptional()
    middleName?: string;

    @IsString()
    @IsOptional()
    lastName?: string;

    @IsString()
    phoneNumber: string;

    @IsArray()
    @IsEnum(UserRole, { each: true })
    roles: UserRole[];
}