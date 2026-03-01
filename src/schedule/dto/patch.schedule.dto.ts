import { BookingStatus } from "../schedule.model";

export class PatchScheduleDto {
    _id: string;
    roomId?: string;
    status: BookingStatus;
}