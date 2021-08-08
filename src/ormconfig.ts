import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { postgres } from './config';

const { host, username, password, database, port, logging, synchronize } =
  postgres;

export const ormConfig = {
  type: 'postgres',
  host: process.env.NODE_ENV !== 'cli' ? host : 'localhost',
  username,
  password,
  database,
  port,
  logging,
  synchronize,
} as TypeOrmModuleOptions;
