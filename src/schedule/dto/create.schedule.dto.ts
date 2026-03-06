import { IsEnum, IsOptional, IsString } from "class-validator";
import { BookingStatus } from "../schedule.model";

export class CreateScheduleDto {
    @IsString({ message: 'The [roomId] property must be a string' })
    roomId: string;

    @IsString({ message: 'The [date] property must be a string' })
    date: string;

    @IsOptional()
    @IsEnum(BookingStatus, { message: `The [status] property must be one of these: ${Object.keys(BookingStatus)}` })
    status?: BookingStatus;
}