import { ormConfig } from './ormconfig';

export default {
  ...ormConfig,
  entities: [],
  migrations: ['migrations/*.ts'],
  migrationRun: false,
  cli: {
    migrationsDir: 'migrations',
  },
};
