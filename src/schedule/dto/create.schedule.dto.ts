import { BookingStatus } from "../schedule.model";

export class CreateScheduleDto {
    roomId: string;
    date: string;
    status?: BookingStatus;
}