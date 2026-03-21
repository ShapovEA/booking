import { IsOptional, IsString } from "class-validator";

export class RegisterAuthDTO {
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
}