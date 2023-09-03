import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@backend/app.module';
import { appDataSource } from '@backend/utils/dbconfig';
import { Profile } from '@backend/typeorm';
import { profiles } from './profiles/profiles.data';

let app: INestApplication;
let server: any;

export function testSetup() {
  beforeAll(async () => {
    await appDataSource.initialize();
    await setupProfile();
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
export async function setupProfile() {
  const profileRepo = appDataSource.manager.getRepository(Profile);
  await appDataSource.query('TRUNCATE TABLE profile RESTART IDENTITY');
  for (const profile of profiles) {
    await profileRepo.insert(profile);
  }
}
export { app, server, appDataSource };
