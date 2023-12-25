import { DefaultSession } from "next-auth";
import { User , FtUser } from './app/api/me/interfaces'

declare module "next-auth" {
    interface Session extends DefaultSession {
        ftUser?: FtUser;
        user: User;
        accessToken: string;
    }
}
