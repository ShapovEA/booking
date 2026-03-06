import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { RoomType } from "../rooms.model";

export class UpdateRoomDto {

        @IsString({ message: 'The [_id] property must be a string' })
        _id: string;

        @IsOptional()
        @IsNumber({}, { message: 'The [number] property must be a number' })
        number?: number;

        @IsOptional()
        @IsEnum(RoomType, { message: `The [type] property must be one of these: ${Object.keys(RoomType)}` })
        type?: RoomType;

        @IsOptional()
        @IsBoolean({ message: 'The [hasSV] property must be a boolean' })
        hasSV?: boolean;
}