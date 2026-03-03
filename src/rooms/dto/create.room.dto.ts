import { RoomType } from "../rooms.model";

export class CreateRoomDto {
        number: number;
        type: RoomType;
        hasSV?: boolean;
}