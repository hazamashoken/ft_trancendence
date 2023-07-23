import * as request from 'supertest';
import { app, appDataSource, server, testSetup } from '../test-setup';

testSetup();

describe('ProfileController (e2e)', () => {
  test('/profile (GET)', async () => {
    // const data = await appDataSource.manager.find(Profile);
    return request(server)
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
