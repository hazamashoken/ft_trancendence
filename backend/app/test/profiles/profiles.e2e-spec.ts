import * as request from 'supertest';
import { app, appDataSource, server, testSetup } from '../test-setup';
import { describe } from 'node:test';
import { Profile } from '@backend/typeorm/profile.entity';

testSetup();

describe('ProfileController (e2e)', () => {
  describe('GET /profiles', () => {
    test('/profile (GET)', async () => {
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
  });

  describe('GET /profiles/:id', () => {
    test('GET /profile/:id Succeed', async () => {
      return request(app.getHttpServer())
        .get('/profiles/1')
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual(
            expect.objectContaining({
              id: 1,
              email: 'thitiwut@student.42bangkok.com',
            }),
          );
        });
    });
    test('GET /profile/:id NotFound', async () => {
      return request(app.getHttpServer()).get('/profiles/500000').expect(404);
    });
    test('GET /profile/:id BadRequest', async () => {
      return request(app.getHttpServer()).get('/profiles/0').expect(400);
    });
  });

  describe('POST /profiles/', () => {
    const profileRepository = appDataSource.manager.getRepository(Profile);
    const inputBody = {
      intraId: 100,
      firstName: 'tester',
      lastName: 'nestjs',
      email: 'tester@student.42.bangkok.com',
    };

    afterEach(async () => {
      const profile = await profileRepository.findOne({
        where: { email: 'tester@student.42.bangkok.com' },
      });
      if (profile) {
        await profileRepository.remove(profile);
      }
    });

    test('POST /profiles Succeed', async () => {
      const req = await request(app.getHttpServer())
        .post('/profiles')
        .send(inputBody)
        .expect(201);
      const profile = await profileRepository.findOne({
        where: { email: 'tester@student.42.bangkok.com' },
      });
      expect(profile).toStrictEqual(expect.objectContaining(profile));
      expect(profile).toBeInstanceOf(Profile);
    });
  });
});
