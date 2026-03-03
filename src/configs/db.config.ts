import { ConfigService } from "@nestjs/config";
import { MongooseModuleOptions } from "@nestjs/mongoose";

export const getDBConfig = async (configService: ConfigService): Promise<MongooseModuleOptions> => {
    return {
        uri: getDBString(configService),
        ...getDBOptions()
    }
}

const getDBString = (configService: ConfigService) => {
    return 'mongodb://'
        + configService.get('DB_USER')
        + ':'
        + configService.get('DB_PASSWORD')
        + '@'
        + configService.get('DB_HOST')
        + ':'
        + configService.get('DB_PORT')
        + '/'
        + configService.get('DB_NAME')
        + '?authSource=admin'
}

const getDBOptions = () => {
    return {

    }
}