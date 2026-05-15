import { config } from 'dotenv';
import { getEnvPath } from '../../common/helper/env.helper';
import { DataSourceOptions } from 'typeorm';

const envFilePath: string = getEnvPath();

config({ path: envFilePath });

const isProduction = process.env.NODE_ENV === 'production';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',

  ...(process.env.DATABASE_URL
    ? {
        url: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT, 10),
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
      }),

  entities: ['dist/**/*.entity.js'],

  migrations: ['dist/database/migration/history/*.js'],

  logger: 'simple-console',

  synchronize: false,

  logging: !isProduction,
};
