import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@backend/app.module';
import { appDataSource } from '@backend/utils/dbconfig';
import { User } from '@backend/typeorm';
import { users } from './user/users.data';

let app: INestApplication;
let server: any;

export function testSetup() {
  beforeAll(async () => {
    await appDataSource.initialize();
    await setupUser();
    await initServer();
  });

  afterAll(async () => {
    await appDataSource.destroy();
    await app.close();
  });
}

export async function initServer() {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  app = moduleFixture.createNestApplication();
  await app.init();
  server = app.getHttpServer();
}

// setup user
export async function setupUser() {
  const userRepo = appDataSource.manager.getRepository(User);
  await appDataSource.query('TRUNCATE TABLE public."user" RESTART IDENTITY');
  for (const user of users) {
    console.log(user);
    await userRepo.insert(user);
  }
}
export { app, server, appDataSource };
