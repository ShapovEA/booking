import { Inject, Injectable } from '@nestjs/common';
import { ITelegramOptions } from 'src/constants/interfaces';
import { RoomsService } from 'src/rooms/rooms.service';
import { UsersService } from 'src/users/users.service';
import { Context, Telegraf } from 'telegraf';

@Injectable()
export class TelegramService {
    bot: Telegraf;
    options: ITelegramOptions;

    constructor(
        @Inject('TELEGRAM_OPTIONS') options: ITelegramOptions,
        private readonly userService: UsersService,
        private readonly roomsService: RoomsService
    ) {
        this.bot = new Telegraf(options.token);
        this.options = options;
    }

    async sendMessage(message: string, chatId: string = this.options.chatId) {
        await this.bot.telegram.sendMessage(chatId, message);
    }

    async notifyScheduleChange(userId: string, roomId: string, newStatus: string) {
        const user = await this.userService.getUser(userId);
        const room = await this.roomsService.getById(roomId);

        if (!user) return;

        const message = `##ROOM STATUS UPDATE##\n`
            + `Room's Number: ${room?.number}\n`
            + `Room's New Status: ${newStatus}\n`
            + `User's name: ${user.firstName ?? 'John'} ${user?.lastName ?? 'Doe'}\n`
            + `User's phone number: ${user.phoneNumber}\n`;

        await this.sendMessage(message);
    }
}
