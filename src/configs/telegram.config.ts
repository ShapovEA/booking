import { ConfigService } from "@nestjs/config";
import { ITelegramOptions } from "src/constants/interfaces";

export const getTelegramConfig = (configService: ConfigService): ITelegramOptions => {
    const token = configService.getOrThrow<string>('TELEGRAM_TOKEN');
    return {
        chatId: configService.get("TELEGRAM_CHAT_ID") ?? '',
        token
    }
}