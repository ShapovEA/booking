import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { RegisterAuthDTO } from './dto/register.auth.dto';
import { AuthService } from './auth.service';
import { LoginAuthDTO } from './dto/login.auth.dto';


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @UsePipes(new ValidationPipe())
    @Post('register')
    async register(@Body() dto: RegisterAuthDTO) {
        return await this.authService.register(dto);
    }

    @UsePipes(new ValidationPipe())
    @Post('login')
    async login(@Body() dto: LoginAuthDTO) {
        const user = await this.authService.validate(dto);
        return user;
    }
}
