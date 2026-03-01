import { BookingStatus } from "../schedule.model";

export class PatchScheduleDto {
    roomId: string;
    status: BookingStatus;
}