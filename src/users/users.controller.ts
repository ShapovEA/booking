import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { CreateUserDTO } from './dto/create.user.dto';
import { UpdateUserDTO } from './dto/update.user.dto';
import { UpdateUserByAdminDTO } from './dto/update.user.admin.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    async getUsers() {
        return await this.usersService.getUsers();
    }

    @Get(':id')
    async getUser(@Param('id', ParseUUIDPipe) id: string) {
        return await this.usersService.getUser(id);
    }

    @Post('create')
    async createUser(@Body() dto: CreateUserDTO) {
        return await this.usersService.createUser(dto);
    }

    @Patch('me')
    async updateUser(@Body() dto: UpdateUserDTO) {
        return await this.usersService.updateUser("idMock", dto);
    }

    @Patch(':id')
    async updateUserByAdmin(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateUserByAdminDTO) {
        return await this.usersService.updateUserByAdmin(id, dto);
    }

    @Delete(':id')
    async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
        return await this.usersService.deleteUser(id);
    }
}
