import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export enum UserRole {
    user = 'user',
    admin = 'admin'
}

@Schema({ timestamps: true, collection: 'users' })
export class UserModel {
    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    passwordHash: string;

    @Prop({ required: true })
    firstName: string;

    @Prop()
    middleName?: string;

    @Prop()
    lastName?: string;

    @Prop({ required: true, unique: true })
    phoneNumber: string;

    @Prop({ type: [String], enum: UserRole, required: true })
    roles: UserRole[];
}

export type UserDocument = HydratedDocument<UserModel>;
export const UserSchema = SchemaFactory.createForClass(UserModel);