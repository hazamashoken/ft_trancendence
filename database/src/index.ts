import 'module-alias/register';
import { AppDataSource } from "./data-source"
import { Profile } from "@entities/profile.entity"
// import { Profile } from "@backend/typeorm/profile.entity"
import profilesSeed from "./seeds/profiles";

AppDataSource.initialize().then(async () => {

  console.log("Inserting a new user into the database...")
  await AppDataSource.createQueryBuilder()
    .insert()
    .into(Profile)
    .values(profilesSeed)
    .execute();

  console.log("Loading profiles from the database...")
  const profiles = await AppDataSource.manager.find(Profile)
  console.log("Loaded profiles: ", profiles)
}).catch(error => console.log(error))
