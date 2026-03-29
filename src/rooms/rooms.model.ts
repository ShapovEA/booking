import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
export enum RoomType {
    ECONOMY = 'ECONOMY',
    STANDART = 'STANDART',
    SUPERIOR = 'SUPERIOR',
    DELUXE = 'DELUXE',
    SUIT = 'SUIT',
    PREMIUM = 'PREMIUM'
}

@Schema({ collection: 'rooms' })
export class RoomsModel {
    @Prop({ required: true, unique: true })
    number: number;

    @Prop({ type: String, enum: RoomType, required: true })
    type: RoomType

    @Prop({ required: true, default: false })
    hasSV: boolean

    @Prop({ type: [String], default: [] })
    images: string[]
}

export type RoomsDocument = HydratedDocument<RoomsModel>;
export const RoomsSchema = SchemaFactory.createForClass(RoomsModel);