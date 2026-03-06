import { IsBoolean, IsEnum, IsNumber, IsOptional } from "class-validator";
import { RoomType } from "../rooms.model";

export class CreateRoomDto {
        @IsNumber({}, { message: 'The [number] property must be a number' })
        number: number;

        @IsEnum(RoomType, { message: `The [type] property must be one of these: ${Object.keys(RoomType)}` })
        type: RoomType;

        @IsOptional()
        @IsBoolean({ message: 'The [hasSV] property must be a boolean' })
        hasSV?: boolean;
}