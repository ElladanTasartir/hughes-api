import { config } from 'dotenv';

config();

const REQUIRED_ENV_VARS = [
  'POSTGRES_HOST',
  'POSTGRES_PORT',
  'POSTGRES_USERNAME',
  'POSTGRES_PASSWORD',
  'POSTGRES_DATABASE',
  'EMAIL_ACCOUNT',
  'PASSWORD_ACCOUNT',
];

REQUIRED_ENV_VARS.forEach((envVar) => {
  const val = process.env[envVar];
  if (!val) {
    throw new Error(`Required ENV VAR not set: ${envVar}`);
  }
});

export const jwt = {
  secret: process.env.JWT_SECRET || 'secret',
  expiresIn: process.env.EXPIRES_IN,
};

export const mail = {
  email: process.env.EMAIL_ACCOUNT,
  pass: process.env.PASSWORD_ACCOUNT,
};

export const postgres = {
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  synchronize: process.env.SYNC_DB === 'true' || false,
  logging: process.env.ORM_LOG_ENABLED === 'true' || false,
};
