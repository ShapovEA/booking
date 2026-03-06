import { IsEnum, IsOptional, IsString } from "class-validator";
import { BookingStatus } from "../schedule.model";

export class PatchScheduleDto {

    @IsString({ message: 'The [_id] property must be a string' })
    _id: string;

    @IsOptional()
    @IsString({ message: 'The [roomId] property must be a string' })
    roomId?: string;

    @IsEnum(BookingStatus, { message: `The [status] property must be one of these: ${Object.keys(BookingStatus)}` })
    status: BookingStatus;
}