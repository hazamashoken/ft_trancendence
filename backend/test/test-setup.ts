import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import { AppModule } from '@backend/app.module';
import { appDataSource } from '@backend/utils/dbconfig';
import { User } from '@backend/typeorm';
import { users } from './user/users.data';
import { XKeyGuard } from '@backend/shared/x-key.guard';
import { AuthGuard } from '@backend/shared/auth.guard';

let app: INestApplication;
let server: any;

const mockAuthUser = {
  id: 103071,
  email: 'tsomsa@student.42bangkok.com',
  login: 'tsomsa',
  first_name: 'Thitiwut',
  last_name: 'Somsa',
  url: 'https://api.intra.42.fr/v2/users/tsomsa',
  kind: 'student',
  image: {
    link: 'https://cdn.intra.42.fr/users/419d49d85cb790463bc56724cb424880/tsomsa.png',
    versions: {
      large:
        'https://cdn.intra.42.fr/users/30864deedba2de0873c998c195f60339/large_tsomsa.png',
      medium:
        'https://cdn.intra.42.fr/users/5250afd358a19a0e95e976efb217eca4/medium_tsomsa.png',
      small:
        'https://cdn.intra.42.fr/users/f528d4e600ec0319df9fe22ca41452a4/small_tsomsa.png',
      micro:
        'https://cdn.intra.42.fr/users/b37c3818db792bb8cd5cfa02067d6952/micro_tsomsa.png',
    },
  },
  titles: [
    { id: 14, name: 'Awesome %login' },
    { id: 21, name: '%login, Khonvoum' },
    { id: 83, name: 'Philanthropist %login' },
    { id: 1370, name: 'Araiva %login' },
  ],
};

export function testSetup(isAuth?: boolean) {
  beforeAll(async () => {
    await appDataSource.initialize();
    await setupUser();
    if (isAuth) {
      await initAuthServer();
    } else {
      await initServer();
    }
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

export async function initAuthServer() {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideGuard(XKeyGuard)
    .useValue({
      canActivate: () => true,
    })
    .overrideGuard(AuthGuard)
    .useValue({
      canActivate: (context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        request.user = mockAuthUser;
        return true;
      },
    })
    .compile();
  app = moduleFixture.createNestApplication();
  await app.init();
  server = app.getHttpServer();
}

// setup user
export async function setupUser() {
  await appDataSource.query(`DROP TABLE banned;`);
  await appDataSource.query(`DROP TABLE messages;`);
  await appDataSource.query(`DROP TABLE muted;`);
  await appDataSource.query(`DROP TABLE active_users;`);
  await appDataSource.query(`DROP TABLE chat_admins;`);
  await appDataSource.query(`DROP TABLE chat_users;`);
  await appDataSource.query(`DROP TABLE chats;`);
  await appDataSource.query(`DROP TABLE user_2fa;`);
  const userRepo = appDataSource.manager.getRepository(User);
  await appDataSource.query('TRUNCATE TABLE public."user" RESTART IDENTITY');
  for (const user of users) {
    // console.log(user);
    await userRepo.insert(user);
  }
}
export { app, server, appDataSource };
