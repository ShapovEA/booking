import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateUserDTO } from './dto/create.user.dto';
import { UpdateUserDTO } from './dto/update.user.dto';
import { UpdateUserByAdminDTO } from './dto/update.user.admin.dto';
import { UsersService } from './users.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from './user.model';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserId } from './decorators/userId.decorator';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }
    @Roles(UserRole.admin)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    async getUsers() {
        return await this.usersService.getUsers();
    }

    @Roles(UserRole.admin, UserRole.user)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':id')
    async getUser(@Param('id', ParseUUIDPipe) id: string) {
        return await this.usersService.getUser(id);
    }

    @Roles(UserRole.admin)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UsePipes(new ValidationPipe())
    @Post('create')
    async createUser(@Body() dto: CreateUserDTO) {
        return await this.usersService.createUser(dto);
    }

    @Roles(UserRole.user, UserRole.admin)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UsePipes(new ValidationPipe())
    @Patch('me')
    async updateUser(@Body() dto: UpdateUserDTO, @UserId() id: string) {
        return await this.usersService.updateUser(id, dto);
    }

    @Roles(UserRole.admin)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Patch(':id')
    async updateUserByAdmin(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateUserByAdminDTO) {
        return await this.usersService.updateUserByAdmin(id, dto);
    }

    @Roles(UserRole.admin)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
        return await this.usersService.deleteUser(id);
    }
}
