import 'module-alias/register';
import { AppDataSource } from "./data-source"
import { User } from "@entities/user.entity"
import userSeed from "./seeds/user";

AppDataSource.initialize().then(async () => {

  console.log("Inserting a new user into the database...")
  await setupUser();
  console.log("Loading profiles from the database...")
  const users = await AppDataSource.manager.find(User)
  console.log("Loaded users: ", users)
}).catch(error => console.log(error))


export async function setupUser() {
  const userRepo = AppDataSource.manager.getRepository(User);
  for (const user of userSeed) {
    await userRepo.insert(user);
  }
}