import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { ITelegramModuleAsyncOptions } from 'src/constants/interfaces';

@Global()
@Module({})
export class TelegramModule {
  static forRootAsync(options: ITelegramModuleAsyncOptions): DynamicModule {
    const configProvider = this.createTelegramProvider(options);
    return {
      module: TelegramModule,
      providers: [TelegramService, configProvider],
      exports: [TelegramService],
      imports: options.imports
    }
  }
  private static createTelegramProvider(options: ITelegramModuleAsyncOptions): Provider {
    return {
      provide: 'TELEGRAM_OPTIONS',
      useFactory: async (...args: any) => {
        const config = options.useFactory(...args);
        return config;
      },
      inject: options.inject || []
    }
  }
}
