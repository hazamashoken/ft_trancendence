import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@backend/app.module';
import { appDataSource } from '@backend/utils/dbconfig';
// import { Profile } from '@entities/profile.entity';

let app: INestApplication;

beforeAll(async () => {
  await appDataSource.initialize();
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  app = moduleFixture.createNestApplication();
  await app.init();
});

describe('ProfileController (e2e)', () => {
  test('/profile (GET)', async () => {
    // const data = await appDataSource.manager.find(Profile);
    return request(app.getHttpServer())
      .get('/profiles')
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(Number),
              email: expect.any(String),
            }),
          ]),
        );
      });
  });
});

afterAll(async () => {
  await appDataSource.destroy();
  await app.close();
});
