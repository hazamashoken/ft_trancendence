import entities from '@backend/typeorm';
import { DataSource } from 'typeorm';

export const appDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'root',
  password: '424242',
  database: 'ft_trancendence',
  entities: entities,
  synchronize: true,
});
