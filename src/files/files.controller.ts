import { BadRequestException, Body, Controller, HttpCode, NotFoundException, Param, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { RoomsService } from 'src/rooms/rooms.service';
import { FilesService } from './files.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/user.model';

@Controller('files')
export class FilesController {
    constructor(
        private readonly roomService: RoomsService,
        private readonly filesService: FilesService
    ) { }

    @Post('upload/for-room/:id')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.admin)
    @UseInterceptors(FilesInterceptor('files'))
    async uploadFilesForRoom(@Param('id') id: string, @UploadedFiles() files: Express.Multer.File[]) {
        const room = await this.roomService.getById(id);
        if (!room) {
            throw new NotFoundException('No room was found by the id provided');
        }
        const existedImages = room.images ?? [];
        const webpFiles = await this.filesService.convertToWebP(files);
        const uploaded = await this.filesService.uploadFiles(webpFiles);
        const newImages = uploaded.map((i) => i.url);
        const images = Array.from(new Set([...existedImages, ...newImages]));
        room.images = images;
        await room.save();
        return room;
    }
}
