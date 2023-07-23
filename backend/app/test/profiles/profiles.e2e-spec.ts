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
              email: 'tsomsa@student.42bangkok.com',
              login: 'tsomsa',
            }),
          );
        });
    });
    test('GET /profile/:id NotFound', async () => {
      return request(app.getHttpServer()).get('/profiles/0').expect(404);
    });
    test('GET /profile/:id BadRequest', async () => {
      return request(app.getHttpServer()).get('/profiles/0').expect(400);
    });
  });

  describe('POST /profiles/:id', () => {
    const profileRepository = appDataSource.manager.getRepository(Profile);
    const inputBody = {
      login: 'tester',
      email: 'tester@student.42.bangkok.com',
    };

    afterEach(async () => {
      const profile = await profileRepository.findOne({
        where: { login: 'tester' },
      });
      console.log(profile);
      if (profile) {
        await profileRepository.remove(profile);
      }
    });

    test('POST /profiles/:id Succeed', async () => {
      await request(app.getHttpServer())
        .post('/profiles/')
        .send(inputBody)
        .expect(201);
      const profile = await profileRepository.findOne({
        where: { login: 'tester' },
      });
      expect(profile).toBe(expect.objectContaining(profile));
    });
  });
});
