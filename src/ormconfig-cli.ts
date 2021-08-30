import { ormConfig } from './ormconfig';

export default {
  ...ormConfig,
  migrations: ['migrations/*.ts'],
  migrationRun: false,
  cli: {
    migrationsDir: 'migrations',
  },
};
