import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@backend/app.module';
import { appDataSource } from '@backend/utils/dbconfig';

let server: any;
let app: INestApplication;

export function testSetup() {
  beforeAll(async () => {
    await appDataSource.initialize();
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

export { app, server, appDataSource };
