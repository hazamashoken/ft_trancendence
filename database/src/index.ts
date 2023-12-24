import 'module-alias/register';
import { AppDataSource } from "./data-source"
import { User } from "@entities/user.entity"
import { Friendship } from '@entities/friendship.entity';
import { UserSession } from '@entities/user-session.entity';
import userSeed from "./seeds/user";
import friendshipSeed from './seeds/friendship';
import userSessionSeed from './seeds/user-session';

AppDataSource.initialize().then(async () => {
  console.log("Inserting a new user into the database...")
  await setupUser();
  console.log("Inserting a new user-session into the database...")
  await setupUserSession();
  console.log("Inserting a new friendship into the database...")
  await setupFriendship();
  
  // console.log("Loading profiles from the database...")
  const users = await AppDataSource.manager.getRepository(User)
    .find({
      select: {id: true, intraLogin: true},
      take: 5
    })
  console.log("Loaded users: ", users)
  const fs = await AppDataSource.manager.getRepository(Friendship)
    .find({
      take: 3
    })
  console.log("Loaded friendship: ", fs)
}).catch(error => console.log(error))


export async function setupUser() {
  const userRepo = AppDataSource.manager.getRepository(User);
  for (const user of userSeed) {
    await userRepo.save(user);
  }
}

export async function setupFriendship() {
  const fsRepo = AppDataSource.manager.getRepository(Friendship);
  for (const seed of friendshipSeed) {
    await fsRepo.save(seed);
  }
}

export async function setupUserSession() {
  const usRepo = AppDataSource.manager.getRepository(UserSession);
  for (const seed of userSessionSeed) {
    await usRepo.save(seed);
  }
}
