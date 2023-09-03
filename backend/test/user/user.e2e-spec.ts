import * as request from 'supertest';
import { app, appDataSource, server, testSetup } from '../test-setup';
import { describe } from 'node:test';
import { User } from '@backend/typeorm/user.entity';

testSetup();

describe('UserController (e2e)', () => {
  describe('GET /users', () => {
    test('/users (GET)', async () => {
      return request(server)
        .get('/users')
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

  describe('GET /users/:id', () => {
    test('GET /users/:id Succeed', async () => {
      return request(app.getHttpServer())
        .get('/users/1')
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
    test('GET /users/:id NotFound', async () => {
      return request(app.getHttpServer()).get('/users/500000').expect(404);
    });
    test('GET /users/:id BadRequest', async () => {
      return request(app.getHttpServer()).get('/users/0').expect(400);
    });
  });

  describe('POST /users/', () => {
    const userRepository = appDataSource.manager.getRepository(User);
    const inputBody = {
      intraId: 100,
      firstName: 'tester',
      lastName: 'nestjs',
      email: 'tester@student.42.bangkok.com',
    };

    afterEach(async () => {
      const user = await userRepository.findOne({
        where: { email: 'tester@student.42.bangkok.com' },
      });
      if (user) {
        await userRepository.remove(user);
      }
    });

    test('POST /users Succeed', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send(inputBody)
        .expect(201);
      const user = await userRepository.findOne({
        where: { email: 'tester@student.42.bangkok.com' },
      });
      expect(user).toStrictEqual(expect.objectContaining(user));
      expect(user).toBeInstanceOf(User);
    });
  });
});
