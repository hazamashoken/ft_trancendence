import "reflect-metadata"
import { DataSource } from "typeorm"
import * as dotenv from "dotenv";
import { Profile } from "@entities/profile.entity";

dotenv.config({ path: '../.env' })

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: +process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [Profile],
    migrations: [],
    subscribers: [],
})
