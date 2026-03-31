import { RoomType } from "../rooms.model";

export class UpdateRoomDto {
        _id: string;
        number?: number;
        type?: RoomType;
        hasSV?: boolean;
        images?: string[]
}