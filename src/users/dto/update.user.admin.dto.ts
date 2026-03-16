import { IsArray, IsEnum, IsOptional, IsString } from "class-validator";
import { UserRole } from "../user.model";

export class UpdateUserByAdminDTO {
    @IsString()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    firstName?: string;

    @IsString()
    @IsOptional()
    middleName?: string;

    @IsString()
    @IsOptional()
    lastName?: string;

    @IsString()
    @IsOptional()
    phoneNumber?: string;

    @IsOptional()
    @IsArray()
    @IsEnum(UserRole, { each: true })
    roles?: UserRole[]
}