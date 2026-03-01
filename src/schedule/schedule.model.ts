import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export enum BookingStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    CHECKED_IN = 'CHECKED_IN',
    CHECKED_OUT = 'CHECKED_OUT',
    CANCELED = 'CANCELED'
}

@Schema({ collection: 'schedule' })
export class ScheduleModel {

    @Prop({ type: Types.ObjectId, ref: 'RoomsModel', required: true })
    roomId: Types.ObjectId

    @Prop({ required: true })
    date: string

    @Prop({ required: true })
    status: BookingStatus
}

export type ScheduleDocument = HydratedDocument<ScheduleModel>;
export const ScheduleSchema = SchemaFactory
    .createForClass(ScheduleModel)
    .index({ roomId: 1, date: 1 }, { unique: true });