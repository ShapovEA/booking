import { IsString } from "class-validator";

export class LoginAuthDTO {
    @IsString()
    email: string;

    @IsString()
    password: string;
}