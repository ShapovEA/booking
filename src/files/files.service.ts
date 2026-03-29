import { Injectable } from '@nestjs/common';
import { MFile } from './mfile.class';
import sharp from 'sharp';
import { format } from 'date-fns';
import { ensureDir, writeFile } from 'fs-extra';
import { path } from 'app-root-path';
import { UploadFileResponseDto } from './dto/upload.file.response.dto';

@Injectable()
export class FilesService {
    async convertToWebP(files: Express.Multer.File[]): Promise<MFile[]> {
        const result: MFile[] = [];
        for (const file of files) {
            if (!file.mimetype.includes('image')) continue;
            const buffer = await sharp(file.buffer)
                .resize(500, null, { withoutEnlargement: true })
                .webp()
                .toBuffer();
            const originalname = file.originalname.split('.')[0];
            result.push({ originalname: `${originalname}.webp`, buffer });
        }
        return result;
    }

    async uploadFiles(files: MFile[]): Promise<UploadFileResponseDto[]> {
        const res: UploadFileResponseDto[] = [];
        const targetCatalog = format(new Date(), 'yyyy-MM-dd');
        const targetPath = `${path}/upload/${targetCatalog}`;
        await ensureDir(targetPath);
        try {
            for (const file of files) {
                await writeFile(`${targetPath}/${file.originalname}`, file.buffer);
                res.push({ url: `${targetCatalog}/${file.originalname}`, originalname: file.originalname })
            }
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
        }
        return res;
    }
}
