import entities from '@backend/typeorm';
import { DataSource } from 'typeorm';
import { env } from './envconfig';

export const appDataSource = new DataSource({
  type: 'postgres',
  host: env.DB_HOST || 'localhost',
  port: +env.DB_PORT || 5432,
  username: env.DB_USERNAME || 'root',
  password: env.DB_PASSWORD || '424242',
  database: env.DB_NAME || 'ft_trancendence',
  entities: entities,
  synchronize: true,
});
